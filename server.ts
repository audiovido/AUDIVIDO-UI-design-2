/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import CryptoJS from 'crypto-js';
import { registerVideoRoutes } from './server/video';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

let cachedSoundCloudClientId: string | null = null;
let lastSoundCloudIdFetch = 0;

interface ScTranscodingMeta {
  trackId: string;
  tcUrl: string;
  protocol: string;
  mimeType: string;
  durationMs: number;
}

interface CachedAudioStream {
  buffer: Buffer;
  contentType: string;
  durationSeconds: number;
  createdAt: number;
}

const scTrackTranscodingMap = new Map<string, ScTranscodingMeta>();
const scAudioBufferCache = new Map<string, CachedAudioStream>();
const scInFlightDownloads = new Map<string, Promise<CachedAudioStream | null>>();
const MAX_SC_BUFFER_CACHE = 18;

function rememberScTranscoding(item: any, bestTc: any): void {
  if (!item?.id || !bestTc?.url) return;
  scTrackTranscodingMap.set(String(item.id), {
    trackId: String(item.id),
    tcUrl: String(bestTc.url),
    protocol: String(bestTc.format?.protocol || 'hls'),
    mimeType: String(bestTc.format?.mime_type || 'audio/mp4'),
    durationMs: Number(item.duration || 0)
  });
}

function pickBestSoundCloudTranscoding(item: any): any | null {
  if (!item || item.policy === 'SNIP' || (item.duration || 0) < 65000) {
    return null;
  }
  // Reject items where full_duration is much larger than duration (indicating a snipped preview)
  if (item.full_duration && item.duration && item.full_duration > item.duration + 5000) {
    return null;
  }
  const transcodings: any[] = Array.isArray(item.media?.transcodings) ? item.media.transcodings : [];
  // 1. Direct progressive MP3 stream
  const progressive = transcodings.find(
    (tc) => !tc.snipped && tc.format?.protocol === 'progressive'
  );
  if (progressive) return progressive;

  // 2. Unencrypted HLS fMP4/AAC stream (assembled into native audio/mp4 by /api/sc-stream)
  const unencryptedHlsMp4 = transcodings.find(
    (tc) =>
      !tc.snipped &&
      tc.format?.protocol === 'hls' &&
      !String(tc.format?.protocol || '').includes('encrypted') &&
      String(tc.format?.mime_type || '').includes('audio/mp4')
  );
  if (unencryptedHlsMp4) return unencryptedHlsMp4;

  // 3. Any other unencrypted HLS transcoding
  const unencryptedHlsOther = transcodings.find(
    (tc) =>
      !tc.snipped &&
      tc.format?.protocol === 'hls' &&
      !String(tc.format?.protocol || '').includes('encrypted')
  );
  return unencryptedHlsOther || null;
}

function decryptJioSaavnStreamUrl(encryptedMediaUrl: string, has320: boolean = true): string | null {
  try {
    if (!encryptedMediaUrl) return null;
    const key = CryptoJS.enc.Utf8.parse('38346591');
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedMediaUrl) } as any,
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    ).toString(CryptoJS.enc.Utf8);
    if (!decrypted || !decrypted.startsWith('http')) return null;
    return has320 ? decrypted.replace('_96.mp4', '_320.mp4') : decrypted.replace('_96.mp4', '_160.mp4');
  } catch {
    return null;
  }
}

async function getSoundCloudClientId(): Promise<string> {
  if (cachedSoundCloudClientId && Date.now() - lastSoundCloudIdFetch < 1000 * 60 * 60 * 12) {
    return cachedSoundCloudClientId;
  }
  try {
    const res = await fetch('https://soundcloud.com');
    const html = await res.text();
    const scriptUrls = [...html.matchAll(/<script[^>]+src="([^">]+\.js)"/g)].map(m => m[1]);
    for (const url of scriptUrls.reverse().slice(0, 10)) {
      const sRes = await fetch(url);
      const text = await sRes.text();
      const match = text.match(/client_id[:=]\s*["']([a-zA-Z0-9]{32})["']/);
      if (match && match[1]) {
        cachedSoundCloudClientId = match[1];
        lastSoundCloudIdFetch = Date.now();
        return match[1];
      }
    }
  } catch (e) {
    console.warn('SoundCloud Client ID fetch error:', e);
  }
  return 'dkevB9EsY4jIoSm8RfddPNUKyn6hurXF';
}

// Middleware
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const BILINGUAL_MUSIC_MAP: Array<[RegExp, string]> = [
  [/کمل\s*رجب|کمل\s*رجاز/gi, 'Camel Rajaz'],
  [/گروه\s*کمل/gi, 'Camel'],
  [/(?:^|\s)کمل(?=\s|$)/gi, 'Camel'],
  [/(?:^|\s)(?:رجب|رجاز)(?=\s|$)/gi, 'Rajaz'],
  [/پینک\s*فلوید/gi, 'Pink Floyd'],
  [/رادیوهد|ریدیوهد/gi, 'Radiohead'],
  [/مدرن\s*تاکینگ/gi, 'Modern Talking'],
  [/لانا\s*دل\s*ری/gi, 'Lana Del Rey'],
  [/ویکند/gi, 'The Weeknd'],
  [/متالیکا/gi, 'Metallica'],
  [/کلدپلی/gi, 'Coldplay'],
  [/امینم/gi, 'Eminem'],
  [/ادل/gi, 'Adele'],
  [/هانس\s*زیمر/gi, 'Hans Zimmer'],
  [/سیامک\s*عباسی/gi, 'Siamak Abbasi'],
  [/سیاوش\s*قمیشی/gi, 'Siavash Ghomayshi'],
  [/شادمهر\s*عقیلی|شادمهر/gi, 'Shadmehr Aghili'],
  [/محسن\s*یگانه/gi, 'Mohsen Yeganeh'],
  [/محسن\s*چاوشی/gi, 'Mohsen Chavoshi'],
  [/فرزاد\s*فرزین/gi, 'Farzad Farzin'],
  [/بهنام\s*بانی/gi, 'Behnam Bani'],
  [/رضا\s*بهرام/gi, 'Reza Bahram'],
  [/گرشا\s*رضایی/gi, 'Garsha Rezaei'],
  [/عرفان\s*طهماسبی/gi, 'Erfan Tahmasbi'],
  [/حامیم/gi, 'Haamim'],
  [/سیروان\s*خسروی/gi, 'Sirvan Khosravi'],
  [/زانیار\s*خسروی/gi, 'Xaniar Khosravi'],
  [/مهدی\s*احمدوند/gi, 'Mehdi Ahmadvand'],
  [/گوگوش/gi, 'Googoosh'],
  [/داریوش/gi, 'Dariush'],
  [/هایده/gi, 'Hayedeh'],
  [/معین/gi, 'Moein'],
  [/ابی/gi, 'Ebi'],
  [/همایون\s*شجریان/gi, 'Homayoun Shajarian'],
  [/علیرضا\s*قربانی/gi, 'Alireza Ghorbani'],
  [/چارتار/gi, 'Chaartaar'],
  [/شایع/gi, 'Shayea'],
  [/یاس/gi, 'Yas'],
  [/فرشته\s*پاک|فرشتهٔ\s*پاک/gi, 'Fereshteye Pak'],
  [/فرنگیس/gi, 'Farangis'],
  [/ستاره/gi, 'Setareh']
];

function expandMusicSearchQuery(raw: string): string {
  let q = ` ${(raw || '').trim()} `;
  if (!q.trim()) return '';
  // Remove filler Persian words like "آهنگ", "موزیک", "ترک", "گروه", "از" when combined with other terms
  const strippedFillers = q
    .replace(/(?:^|\s)(?:آهنگ|موزیک|ترک|گروه|از|خواننده)(?=\s|$)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (strippedFillers.length >= 2) {
    q = ` ${strippedFillers} `;
  }
  for (const [pattern, replacement] of BILINGUAL_MUSIC_MAP) {
    q = q.replace(pattern, ` ${replacement} `);
  }
  return q.replace(/\s+/g, ' ').trim();
}

function normalizeTokenString(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/aa/g, 'a')
    .replace(/oo|ou/g, 'o')
    .replace(/ee/g, 'i')
    .replace(/eh\b/g, 'e')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCanonicalTitleAndArtist(
  rawTitle: string,
  rawUploader: string,
  publisherArtist?: string,
  queryHint?: string
): { title: string; artist: string } {
  // 1. Clean leading symbols like ▶, ►, ●, numbers, and underscores used as spaces
  let cleaned = (rawTitle || '')
    .replace(/^[▶►●★☆•\-~\s]+/g, '')
    .replace(/_+/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();

  // If bilingual with '|', prefer the Latin side for canonical matching while keeping clean display
  if (cleaned.includes('|')) {
    const parts = cleaned.split('|').map((p) => p.trim()).filter(Boolean);
    const latinPart = parts.find((p) => /[a-zA-Z]{2,}/.test(p));
    cleaned = latinPart || parts[0] || cleaned;
  }

  // Strip noisy tags in parentheses/brackets like (Official Audio), [320kbps], (Full), etc.
  cleaned = cleaned
    .replace(/\((?:official|audio|video|lyric|lyrics|hd|4k|hq|full|320\s*kbps|160\s*k|mp3|free\s*download|original\s*mix|remaster(?:ed)?).*?\)/gi, '')
    .replace(/\[(?:official|audio|video|lyric|lyrics|hd|4k|hq|full|320\s*kbps|160\s*k|mp3|free\s*download|original\s*mix|remaster(?:ed)?).*?\]/gi, '')
    .replace(/\b(?:official\s*audio|official\s*video|music\s*video|320\s*kbps|160k|free\s*download)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  let artist = (publisherArtist || '').trim();
  let title = cleaned;

  // Split "Artist - Title" or "Title - Artist"
  const dashParts = cleaned.split(/\s*[-–—]\s*/).map((p) => p.trim()).filter(Boolean);
  if (dashParts.length === 2) {
    const left = dashParts[0];
    const right = dashParts[1];
    const qNorm = normalizeTokenString(queryHint || '');
    // Default convention is "Artist - Song Title"
    artist = artist || left;
    title = right;

    // If right side is a known artist name or matches query prefix while left is the song title (e.g. "Time - Pink Floyd")
    if (
      publisherArtist &&
      normalizeTokenString(right) === normalizeTokenString(publisherArtist) &&
      normalizeTokenString(left) !== normalizeTokenString(publisherArtist)
    ) {
      artist = right;
      title = left;
    } else if (qNorm && qNorm.startsWith(normalizeTokenString(right)) && !qNorm.startsWith(normalizeTokenString(left))) {
      artist = right;
      title = left;
    }
  } else if (dashParts.length > 2) {
    // Handle cases like "Siamak - Abbasi - Fereshteye - Pak" or "Artist - Album - Song"
    artist = artist || `${dashParts[0]} ${dashParts[1]}`;
    title = dashParts.slice(2).join(' ');
  } else if (cleaned.includes(',')) {
    const commaParts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);
    if (commaParts.length === 2 && !artist) {
      title = commaParts[0];
      artist = commaParts[1];
    }
  }

  if (!artist) {
    artist = (rawUploader || '')
      .replace(/ - Topic$/i, '')
      .replace(/VEVO$/i, '')
      .replace(/\bOfficial\b/gi, '')
      .trim();
  }

  return {
    title: title.trim() || rawTitle.trim(),
    artist: artist.trim() || rawUploader.trim() || 'Studio Artist'
  };
}

function scoreStreamCandidate(params: {
  title: string;
  artist: string;
  rawTitle?: string;
  durationSeconds: number;
  query: string;
  targetTitle?: string;
  targetArtist?: string;
  targetDurationSeconds?: number;
  qualityTier: 'lossless_archive' | 'saavn_320' | 'sc_progressive' | 'sc_hls' | 'audius_320' | 'ytm_master' | 'catalog';
  playCount?: number;
}): number {
  const {
    title,
    artist,
    rawTitle = title,
    durationSeconds,
    query,
    targetTitle,
    targetArtist,
    targetDurationSeconds,
    qualityTier,
    playCount = 0
  } = params;

  // Strictly reject 30-second demos or very short clips (< 60s)
  if (!durationSeconds || durationSeconds < 60) {
    return -10000;
  }

  const expandedQuery = expandMusicSearchQuery(query);
  const queryNorm = normalizeTokenString(expandedQuery);
  const titleNorm = normalizeTokenString(title);
  const artistNorm = normalizeTokenString(artist);
  const rawCombinedNorm = normalizeTokenString(`${rawTitle} ${title} ${artist}`);

  const queryTokens = [...new Set(queryNorm.split(' '))].filter((t) => t.length >= 2);

  // Check token overlap — if zero tokens from the query match, reject unrelated tracks
  let matchedTokens = 0;
  for (const token of queryTokens) {
    if (rawCombinedNorm.includes(token)) {
      matchedTokens++;
    }
  }
  if (queryTokens.length > 0 && matchedTokens === 0) {
    return -5000;
  }

  // If query has >= 2 distinct tokens (e.g. Artist + Song like "Camel Rajaz"), reject candidates that only match 1 token from unrelated catalogs
  if (queryTokens.length >= 2 && matchedTokens < Math.min(2, queryTokens.length)) {
    return -2500;
  }

  let score = 0;

  // 1. Token coverage score (up to +500)
  if (queryTokens.length > 0) {
    const coverageRatio = matchedTokens / queryTokens.length;
    score += Math.round(coverageRatio * 350);
    if (matchedTokens === queryTokens.length) {
      score += 180; // All search words matched!
    }
  }

  // 2. Target Title & Artist exact/prefix matching
  const tTitleNorm = normalizeTokenString(targetTitle || '');
  const tArtistNorm = normalizeTokenString(targetArtist || '');

  if (tTitleNorm && tArtistNorm) {
    if (titleNorm === tTitleNorm && artistNorm === tArtistNorm) {
      score += 500;
    } else {
      if (titleNorm === tTitleNorm || titleNorm.startsWith(tTitleNorm)) score += 240;
      else if (titleNorm.includes(tTitleNorm) || tTitleNorm.includes(titleNorm)) score += 120;

      if (artistNorm === tArtistNorm || artistNorm.includes(tArtistNorm) || tArtistNorm.includes(artistNorm)) {
        score += 220;
      }
    }
  } else {
    // Query phrase match against title + artist
    if (`${artistNorm} ${titleNorm}` === queryNorm || `${titleNorm} ${artistNorm}` === queryNorm) {
      score += 480;
    } else if (titleNorm === queryNorm || artistNorm === queryNorm) {
      score += 320;
    } else if (titleNorm.startsWith(queryNorm) || `${artistNorm} ${titleNorm}`.startsWith(queryNorm)) {
      score += 220;
    }
  }

  // 3. Studio Master Authenticity vs Unwanted Remix / Cover / Live / Slowed / Karaoke
  const unwantedVariants = [
    'remix', 'dj ', 'bootleg', 'mashup', 'cover', 'tribute', 'karaoke',
    'originally performed', 'originally perfomed', 'melody version',
    'instrumental', 'backing track', 'minus one', 'slowed', 'reverb',
    'sped up', 'nightcore', '8d audio', 'medley', 'podcast', 'interview',
    'teaser', 'demo', 'snippet', 'preview', 'promo', 'amapiano', 'rework', 'flip', 'ringtone'
  ];
  const liveVariants = ['live ', 'live at', 'live in', 'concert', 'tour '];

  const userAskedVariant = unwantedVariants.some((w) => queryNorm.includes(w.trim()));
  const userAskedLive = liveVariants.some((w) => queryNorm.includes(w.trim()));

  const checkText = `${rawTitle} ${title} ${artist}`.toLowerCase();
  if (!userAskedVariant && unwantedVariants.some((w) => checkText.includes(w))) {
    score -= 650;
  } else {
    score += 160; // Clean studio master bonus
  }

  if (!userAskedLive && liveVariants.some((w) => checkText.includes(w))) {
    score -= 220;
  }

  // Penalize short 60s-115s radio/label promo snippets when standard full-length tracks (>= 120s) exist
  if (durationSeconds < 115 && (!targetDurationSeconds || targetDurationSeconds >= 120)) {
    score -= 340;
  }

  // Penalize 1-hour mixes or very long DJ sets (> 15 mins) unless requested
  if (durationSeconds > 950 && !queryNorm.includes('mix') && !queryNorm.includes('full album')) {
    score -= 350;
  }

  // 4. Studio Duration Verification (matches Apple Music / Spotify canonical length)
  if (targetDurationSeconds && targetDurationSeconds >= 65) {
    const diff = Math.abs(durationSeconds - targetDurationSeconds);
    if (diff <= 4) score += 320;
    else if (diff <= 10) score += 220;
    else if (diff <= 25) score += 100;
    else if (diff > 60) score -= 260;
  }

  // 5. Audio Source Bitrate & Stream Quality Tier
  switch (qualityTier) {
    case 'saavn_320':
      score += 240; // Direct 320kbps MP4 studio stream
      break;
    case 'lossless_archive':
      score += 235; // Direct Archive.org Studio Master MP3/FLAC
      break;
    case 'sc_progressive':
      score += 230; // Direct unencrypted progressive MP3 master stream
      break;
    case 'sc_hls':
      score += 220; // Full fMP4/AAC 160kbps studio stream assembled via /api/sc-stream
      break;
    case 'audius_320':
      score += 190;
      break;
    case 'ytm_master':
      score += 175;
      break;
    case 'catalog':
      score += 150;
      break;
  }

  // Subtle popularity tie-breaker (up to +40 points)
  if (playCount > 0) {
    score += Math.min(40, Math.round(Math.log10(playCount + 1) * 7));
  }

  return score;
}

/**
 * Search Internet Archive (archive.org) for Direct Full-Length Studio MP3/FLAC Audio Files
 */
async function searchArchiveOrgStudioAudio(
  query: string,
  targetTitle?: string,
  targetArtist?: string,
  targetDurationSeconds?: number
): Promise<any[]> {
  try {
    const expanded = expandMusicSearchQuery(query);
    const words = normalizeTokenString(expanded)
      .split(' ')
      .filter((w) => w.length >= 2);
    if (words.length === 0) return [];

    const luceneQuery =
      targetTitle && targetArtist
        ? `(${targetTitle}) AND (${targetArtist}) AND mediatype:(audio)`
        : `(${words.join(' AND ')}) AND mediatype:(audio)`;

    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      luceneQuery
    )}&fl[]=identifier,title,creator,year&rows=5&output=json`;

    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const data: any = await res.json();
    const docs: any[] = data?.response?.docs || [];
    if (docs.length === 0) return [];

    const matchedTracks: any[] = [];

    await Promise.all(
      docs.slice(0, 3).map(async (doc) => {
        try {
          const metaRes = await fetch(`https://archive.org/metadata/${doc.identifier}`, {
            signal: AbortSignal.timeout(3500)
          });
          if (!metaRes.ok) return;
          const meta: any = await metaRes.json();
          const files: any[] = Array.isArray(meta.files) ? meta.files : [];
          const mp3Files = files.filter(
            (f) =>
              typeof f.name === 'string' &&
              (f.name.toLowerCase().endsWith('.mp3') || f.name.toLowerCase().endsWith('.m4a')) &&
              !f.name.toLowerCase().includes('sample')
          );

          for (const f of mp3Files) {
            const rawLen = parseFloat(f.length || '0');
            const durSec = !isNaN(rawLen) && rawLen > 10 ? Math.round(rawLen) : 0;
            if (durSec > 0 && durSec < 60) continue;

            const fileBase = f.name
              .replace(/\.[^/.]+$/, '')
              .replace(/^\d+[\s._-]+/, '')
              .replace(/_/g, ' ');
            const rawTrackTitle = f.title || fileBase || doc.title || '';
            const rawCreator = f.artist || f.creator || doc.creator || '';
            const parsed = parseCanonicalTitleAndArtist(rawTrackTitle, rawCreator, rawCreator, expanded);

            const score = scoreStreamCandidate({
              title: parsed.title,
              artist: parsed.artist,
              rawTitle: `${doc.title || ''} ${rawTrackTitle}`,
              durationSeconds: durSec || targetDurationSeconds || 240,
              query: expanded,
              targetTitle,
              targetArtist,
              targetDurationSeconds,
              qualityTier: 'lossless_archive'
            });

            if (score > 0) {
              matchedTracks.push({
                id: `archive-${doc.identifier}-${f.name}`,
                title: parsed.title,
                artist: parsed.artist,
                album: doc.title || 'Studio Archive Master',
                genre: 'Lossless / Studio Master',
                year: String(doc.year || meta.metadata?.date || '2024').slice(0, 4),
                durationSeconds: durSec || targetDurationSeconds || 240,
                artwork: `https://archive.org/services/img/${doc.identifier}`,
                streamUrl: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${encodeURIComponent(f.name)}`,
                source: 'SoundCloud',
                score
              });
            }
          }
        } catch {}
      })
    );

    return matchedTracks.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

// API 1: YouTube Music Search (Enriched with iTunes & Deezer Deep Metadata)
app.get('/api/ytmusic-search', async (req, res) => {
  try {
    const rawQuery = String(req.query.q || req.query.query || '').trim();
    const query = expandMusicSearchQuery(rawQuery);
    if (!query) {
      return res.json({ results: [] });
    }

    const [ytmSettled, itunesSettled, deezerSettled] = await Promise.allSettled([
      fetch('https://music.youtube.com/youtubei/v1/search?prettyPrint=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://music.youtube.com/'
        },
        body: JSON.stringify({
          context: { client: { clientName: 'WEB_REMIX', clientVersion: '1.20240101.01.00', gl: 'US', hl: 'en' } },
          query: query
        }),
        signal: AbortSignal.timeout(6000)
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`, {
        signal: AbortSignal.timeout(5000)
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=15`, {
        signal: AbortSignal.timeout(5000)
      }).then((r) => (r.ok ? r.json() : null))
    ]);

    const ytmData: any = ytmSettled.status === 'fulfilled' ? ytmSettled.value : null;
    const text = ytmData ? JSON.stringify(ytmData) : '';
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const videoIds = [...new Set([...text.matchAll(regex)].map((m) => m[1]))].slice(0, 15);

    const itunesTracks: any[] = (itunesSettled.status === 'fulfilled' && itunesSettled.value?.results) || [];
    const deezerTracks: any[] = (deezerSettled.status === 'fulfilled' && deezerSettled.value?.data) || [];

    const negativeWords = ['karaoke', 'instrumental', 'backing track', 'tribute', 'remake', 'minus one'];
    const officialResults = await Promise.all(
      videoIds.slice(0, 12).map(async (id) => {
        try {
          const oRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, {
            signal: AbortSignal.timeout(4000)
          });
          if (!oRes.ok) return null;
          const oData: any = await oRes.json();
          const rawTitle = oData.title || '';
          const titleLower = rawTitle.toLowerCase();

          if (negativeWords.some((w) => titleLower.includes(w))) {
            return null;
          }

          const parsed = parseCanonicalTitleAndArtist(rawTitle, oData.author_name || '', undefined, query);
          const cleanTitle = parsed.title;
          const cleanArtist = parsed.artist;

          const normTitle = normalizeTokenString(cleanTitle);
          const normArtist = normalizeTokenString(cleanArtist);

          const match = itunesTracks.find((it) => {
            const itTitle = normalizeTokenString(it.trackName || '');
            const itArtist = normalizeTokenString(it.artistName || '');
            return (
              itTitle &&
              (normTitle === itTitle || normTitle.includes(itTitle) || itTitle.includes(normTitle)) &&
              (!normArtist || itArtist.includes(normArtist) || normArtist.includes(itArtist))
            );
          });

          const dzMatch = deezerTracks.find((dz) => {
            const dzTitle = normalizeTokenString(dz.title || '');
            const dzArtist = normalizeTokenString(dz.artist?.name || '');
            return (
              dzTitle &&
              (normTitle === dzTitle || normTitle.includes(dzTitle) || dzTitle.includes(normTitle)) &&
              (!normArtist || dzArtist.includes(normArtist) || normArtist.includes(dzArtist))
            );
          });

          const cover =
            match?.artworkUrl100?.replace('100x100bb', '600x600bb') ||
            dzMatch?.album?.cover_xl ||
            dzMatch?.album?.cover_big ||
            oData.thumbnail_url ||
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

          const durationSec = match?.trackTimeMillis
            ? Math.round(match.trackTimeMillis / 1000)
            : dzMatch?.duration || 215;
          const mins = Math.floor(durationSec / 60);
          const secs = durationSec % 60;
          const releaseYear = match?.releaseDate
            ? String(new Date(match.releaseDate).getFullYear())
            : '2024';

          const finalTitle = match?.trackName || dzMatch?.title || cleanTitle;
          const finalArtist = match?.artistName || dzMatch?.artist?.name || cleanArtist;

          const score = scoreStreamCandidate({
            title: finalTitle,
            artist: finalArtist,
            rawTitle,
            durationSeconds: durationSec,
            query,
            qualityTier: 'ytm_master'
          });

          if (score < 0) return null;

          return {
            id: `ytm-${id}`,
            videoId: id,
            title: finalTitle,
            artist: finalArtist,
            album: match?.collectionName || dzMatch?.album?.title || 'Official Release',
            genre: match?.primaryGenreName || 'Official Master',
            year: releaseYear,
            duration: `${mins}:${secs.toString().padStart(2, '0')}`,
            durationSeconds: durationSec,
            coverUrl: cover,
            source: 'YouTubeMusic',
            isFullTrack: true,
            score
          };
        } catch {
          return null;
        }
      })
    );

    const sorted = officialResults
      .filter(Boolean)
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

    res.json({ results: sorted });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, results: [] });
  }
});

// Helper: Assemble full SoundCloud stream (Progressive MP3 or HLS fMP4/MP3 segments) into a single native Buffer
async function getOrDownloadSoundCloudStream(trackId: string, tcUrlParam?: string): Promise<CachedAudioStream | null> {
  const cacheKey = trackId || tcUrlParam || '';
  if (!cacheKey) return null;

  const cached = scAudioBufferCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < 1000 * 60 * 45) {
    return cached;
  }

  if (scInFlightDownloads.has(cacheKey)) {
    return scInFlightDownloads.get(cacheKey)!;
  }

  const downloadPromise = (async (): Promise<CachedAudioStream | null> => {
    try {
      const clientId = await getSoundCloudClientId();
      let meta = trackId ? scTrackTranscodingMap.get(trackId) : undefined;

      if (!meta && trackId && /^\d+$/.test(trackId)) {
        const trackRes = await fetch(`https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${clientId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(5000)
        });
        if (trackRes.ok) {
          const trackData: any = await trackRes.json();
          const bestTc = pickBestSoundCloudTranscoding(trackData);
          if (bestTc) {
            rememberScTranscoding(trackData, bestTc);
            meta = scTrackTranscodingMap.get(String(trackData.id));
          }
        }
      }

      const tcUrl = meta?.tcUrl || tcUrlParam;
      if (!tcUrl) return null;

      const sep = tcUrl.includes('?') ? '&' : '?';
      const sRes = await fetch(`${tcUrl}${sep}client_id=${clientId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(4500)
      });
      if (!sRes.ok) return null;
      const sData: any = await sRes.json();
      const signedUrl = String(sData?.url || '');
      if (!signedUrl) return null;

      // Case 1: Progressive direct MP3 stream
      if (!signedUrl.includes('.m3u8')) {
        const audioRes = await fetch(signedUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(15000)
        });
        if (!audioRes.ok) return null;
        const arr = await audioRes.arrayBuffer();
        const buffer = Buffer.from(arr);
        if (buffer.length < 150000) return null; // Reject tiny/broken files
        const result: CachedAudioStream = {
          buffer,
          contentType: audioRes.headers.get('content-type') || 'audio/mpeg',
          durationSeconds: meta?.durationMs ? Math.round(meta.durationMs / 1000) : 210,
          createdAt: Date.now()
        };
        if (scAudioBufferCache.size >= MAX_SC_BUFFER_CACHE) {
          const oldestKey = scAudioBufferCache.keys().next().value;
          if (oldestKey) scAudioBufferCache.delete(oldestKey);
        }
        scAudioBufferCache.set(cacheKey, result);
        return result;
      }

      // Case 2: HLS playlist (.m3u8) -> Download init.mp4 (if fMP4) + all media segments and concatenate into native MP4/MP3
      const m3u8Res = await fetch(signedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(5000)
      });
      if (!m3u8Res.ok) return null;
      const m3u8Text = await m3u8Res.text();

      // Calculate total playlist duration and reject any 30-second snipped stream (< 60s)
      const extInfMatches = [...m3u8Text.matchAll(/#EXTINF:([\d.]+)/g)];
      const totalPlaylistSeconds = extInfMatches.reduce((acc, m) => acc + (parseFloat(m[1]) || 0), 0);
      if (totalPlaylistSeconds > 0 && totalPlaylistSeconds < 60) {
        return null;
      }

      const mapMatch = m3u8Text.match(/#EXT-X-MAP:URI="([^"]+)"/);
      const initUrl = mapMatch ? mapMatch[1] : null;

      const segmentUrls = m3u8Text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('http://') || line.startsWith('https://'));

      if (segmentUrls.length === 0) return null;

      const allUrls = initUrl ? [initUrl, ...segmentUrls] : segmentUrls;
      const segmentBuffers: Buffer[] = new Array(allUrls.length);
      const BATCH_SIZE = 14;

      for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
        const batch = allUrls.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (segUrl, idx) => {
            const segRes = await fetch(segUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
              signal: AbortSignal.timeout(8000)
            });
            if (!segRes.ok) {
              throw new Error(`Segment fetch failed with status ${segRes.status}`);
            }
            const ab = await segRes.arrayBuffer();
            segmentBuffers[i + idx] = Buffer.from(ab);
          })
        );
      }

      const fullBuffer = Buffer.concat(segmentBuffers);
      if (fullBuffer.length < 150000) return null;

      const isMp4 = Boolean(initUrl) || String(meta?.mimeType || '').includes('mp4');
      const result: CachedAudioStream = {
        buffer: fullBuffer,
        contentType: isMp4 ? 'audio/mp4' : 'audio/mpeg',
        durationSeconds: Math.round(totalPlaylistSeconds) || (meta?.durationMs ? Math.round(meta.durationMs / 1000) : 210),
        createdAt: Date.now()
      };

      if (scAudioBufferCache.size >= MAX_SC_BUFFER_CACHE) {
        const oldestKey = scAudioBufferCache.keys().next().value;
        if (oldestKey) scAudioBufferCache.delete(oldestKey);
      }
      scAudioBufferCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('SoundCloud full stream assembly error:', err);
      return null;
    } finally {
      scInFlightDownloads.delete(cacheKey);
    }
  })();

  scInFlightDownloads.set(cacheKey, downloadPromise);
  return downloadPromise;
}

// API 2: Multi-Source Studio Master Audio Stream Resolver
// Evaluates SoundCloud Progressive/AAC, JioSaavn 320kbps, Internet Archive Lossless/MP3, Audius, and YouTube Music in parallel
// Picks the single highest-scoring, highest-bitrate full studio track — strictly ZERO 30-second demos!
app.get('/api/resolve-stream', async (req, res) => {
  try {
    const rawQuery = String(req.query.q || req.query.query || '').trim();
    const targetTitle = String(req.query.title || '').trim();
    const targetArtist = String(req.query.artist || '').trim();
    let targetDurationSeconds = Number(req.query.duration || 0) || undefined;

    const query = expandMusicSearchQuery(
      rawQuery || `${targetArtist} ${targetTitle}`.trim()
    );
    if (!query) {
      return res.json({ streamUrl: null });
    }

    // If caller didn't supply canonical studio duration, look it up from Apple Music / iTunes metadata quickly
    if (!targetDurationSeconds || targetDurationSeconds < 65) {
      try {
        const itRes = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`,
          { signal: AbortSignal.timeout(2200) }
        );
        if (itRes.ok) {
          const itData: any = await itRes.json();
          const firstMatch = (itData?.results || []).find(
            (r: any) => r.trackTimeMillis && r.trackTimeMillis >= 65000
          );
          if (firstMatch) {
            targetDurationSeconds = Math.round(firstMatch.trackTimeMillis / 1000);
          }
        }
      } catch {}
    }

    const candidates: Array<{
      streamUrl: string;
      durationSeconds: number;
      title: string;
      artist: string;
      source: string;
      score: number;
    }> = [];

    // Run high-bitrate full-track sources in parallel and pick the best match
    await Promise.allSettled([
      // Source A: SoundCloud Full Unencrypted Master Stream (Progressive MP3 or Native fMP4 via /api/sc-stream)
      (async () => {
        try {
          const clientId = await getSoundCloudClientId();
          const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=25`;
          const response = await fetch(scUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(5500)
          });
          if (!response.ok) return;
          const data: any = await response.json();
          const rawCollection: any[] = Array.isArray(data.collection) ? data.collection : [];

          const scoredItems = rawCollection
            .map((item: any) => {
              const bestTc = pickBestSoundCloudTranscoding(item);
              if (!bestTc) return null;
              const durSec = Math.round((item.duration || 0) / 1000);
              const pubArtist = item.publisher_metadata?.artist || '';
              const parsed = parseCanonicalTitleAndArtist(
                item.title || '',
                item.user?.username || '',
                pubArtist,
                query
              );
              const isProgressive = bestTc.format?.protocol === 'progressive';
              const score = scoreStreamCandidate({
                title: parsed.title,
                artist: parsed.artist,
                rawTitle: item.title || '',
                durationSeconds: durSec,
                query,
                targetTitle,
                targetArtist,
                targetDurationSeconds,
                qualityTier: isProgressive ? 'sc_progressive' : 'sc_hls',
                playCount: item.playback_count || 0
              });
              return score > 0 ? { item, bestTc, parsed, durSec, score, isProgressive } : null;
            })
            .filter(Boolean)
            .sort((a: any, b: any) => b.score - a.score);

          for (const entry of scoredItems.slice(0, 3)) {
            if (!entry) continue;
            rememberScTranscoding(entry.item, entry.bestTc);
            // Serve via /api/sc-stream so browser <audio> gets a full native MP4/MP3 stream with Range support and zero 30s HLS cutoff
            const streamUrl = `/api/sc-stream?id=${encodeURIComponent(String(entry.item.id))}`;
            candidates.push({
              streamUrl,
              durationSeconds: entry.durSec,
              title: entry.parsed.title,
              artist: entry.parsed.artist,
              source: 'SoundCloud',
              score: entry.score
            });
            break;
          }
        } catch {}
      })(),

      // Source B: JioSaavn 320kbps Studio Master Direct MP4 Stream
      (async () => {
        try {
          const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=10&p=1&q=${encodeURIComponent(query)}`;
          const saavnRes = await fetch(saavnUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            signal: AbortSignal.timeout(4500)
          });
          if (!saavnRes.ok) return;
          const saavnData: any = await saavnRes.json();
          const items: any[] = Array.isArray(saavnData.results) ? saavnData.results : [];
          for (const item of items) {
            const dur = Number(item.more_info?.duration || 0);
            const rawTitle = String(item.title || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            const primaryArtists =
              item.more_info?.artistMap?.primary_artists?.map((a: any) => a.name).join(', ') ||
              item.subtitle ||
              '';
            if (dur >= 65 && item.more_info?.encrypted_media_url) {
              const score = scoreStreamCandidate({
                title: rawTitle,
                artist: primaryArtists,
                rawTitle: `${rawTitle} ${primaryArtists}`,
                durationSeconds: dur,
                query,
                targetTitle,
                targetArtist,
                targetDurationSeconds,
                qualityTier: 'saavn_320',
                playCount: Number(item.play_count || 0)
              });
              if (score > 0) {
                const streamUrl = decryptJioSaavnStreamUrl(
                  item.more_info.encrypted_media_url,
                  item.more_info['320kbps'] === 'true'
                );
                if (streamUrl) {
                  candidates.push({
                    streamUrl,
                    durationSeconds: dur,
                    title: rawTitle,
                    artist: primaryArtists,
                    source: 'Saavn',
                    score
                  });
                }
              }
            }
          }
        } catch {}
      })(),

      // Source C: Internet Archive (archive.org) Lossless / VBR MP3 Studio Master
      (async () => {
        try {
          const archiveMatches = await searchArchiveOrgStudioAudio(
            query,
            targetTitle,
            targetArtist,
            targetDurationSeconds
          );
          for (const m of archiveMatches.slice(0, 2)) {
            candidates.push({
              streamUrl: m.streamUrl,
              durationSeconds: m.durationSeconds,
              title: m.title,
              artist: m.artist,
              source: 'ArchiveMaster',
              score: m.score
            });
          }
        } catch {}
      })(),

      // Source D: Audius 320kbps Open Stream
      (async () => {
        try {
          const auHostsRes = await fetch('https://api.audius.co', { signal: AbortSignal.timeout(3000) });
          if (!auHostsRes.ok) return;
          const auHosts: any = await auHostsRes.json();
          const host = auHosts?.data?.[0];
          if (!host) return;
          const auSearchRes = await fetch(
            `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=AudioVido`,
            { signal: AbortSignal.timeout(3800) }
          );
          if (!auSearchRes.ok) return;
          const auData: any = await auSearchRes.json();
          for (const item of (auData?.data || []).slice(0, 6)) {
            const dur = Number(item.duration || 0);
            if (dur >= 65 && item.id) {
              const parsed = parseCanonicalTitleAndArtist(
                item.title || '',
                item.user?.name || '',
                undefined,
                query
              );
              const score = scoreStreamCandidate({
                title: parsed.title,
                artist: parsed.artist,
                rawTitle: item.title || '',
                durationSeconds: dur,
                query,
                targetTitle,
                targetArtist,
                targetDurationSeconds,
                qualityTier: 'audius_320',
                playCount: Number(item.play_count || 0)
              });
              if (score > 0) {
                candidates.push({
                  streamUrl: `${host}/v1/tracks/${item.id}/stream?app_name=AudioVido`,
                  durationSeconds: dur,
                  title: parsed.title,
                  artist: parsed.artist,
                  source: 'Audius',
                  score
                });
              }
            }
          }
        } catch {}
      })()
    ]);

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      // Pre-warm SoundCloud stream cache asynchronously if top choice is /api/sc-stream
      if (best.streamUrl.startsWith('/api/sc-stream?id=')) {
        const scId = best.streamUrl.split('id=')[1];
        if (scId) {
          getOrDownloadSoundCloudStream(decodeURIComponent(scId)).catch(() => {});
        }
      }
      return res.json(best);
    }

    // Fallback Tier: YouTube Music + Invidious / Piped High-Bitrate Full Audio Stream
    try {
      const ytmRes = await fetch('https://music.youtube.com/youtubei/v1/search?prettyPrint=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://music.youtube.com/'
        },
        body: JSON.stringify({
          context: { client: { clientName: 'WEB_REMIX', clientVersion: '1.20240101.01.00', gl: 'US', hl: 'en' } },
          query: query
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (ytmRes.ok) {
        const ytmData: any = await ytmRes.json();
        const text = JSON.stringify(ytmData);
        const videoMatches = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
        const videoId = videoMatches[0];

        if (videoId) {
          const invidiousHosts = [
            'https://invidious.f5.si',
            'https://iv.ggtyler.dev',
            'https://invidious.jing.rocks',
            'https://inv.tux.pizza'
          ];

          for (const host of invidiousHosts) {
            try {
              const vRes = await fetch(`${host}/api/v1/videos/${videoId}`, { signal: AbortSignal.timeout(3500) });
              if (vRes.ok) {
                const vData: any = await vRes.json();
                const audios = (vData.adaptiveFormats || []).filter((f: any) => f.type && f.type.startsWith('audio/'));
                const bestAudio = audios[audios.length - 1] || audios[0];
                if (bestAudio?.url && (vData.lengthSeconds || 180) >= 65) {
                  return res.json({
                    streamUrl: `/api/audio-proxy?url=${encodeURIComponent(bestAudio.url)}`,
                    rawAudioUrl: bestAudio.url,
                    durationSeconds: vData.lengthSeconds || 180,
                    title: vData.title,
                    artist: vData.author,
                    source: 'YouTubeMusic'
                  });
                }
              }
            } catch {}
          }
        }
      }
    } catch {}

    res.json({ streamUrl: null });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, streamUrl: null });
  }
});

// API 3: SoundCloud Full-Track Search (Canonical Spotify/Apple Music Normalization + Deduplication + Relevance/Bitrate Ranking)
app.get('/api/soundcloud-search', async (req, res) => {
  try {
    const rawQuery = String(req.query.q || req.query.query || '').trim();
    const query = expandMusicSearchQuery(rawQuery);
    if (!query) {
      return res.json({ collection: [] });
    }

    const clientId = await getSoundCloudClientId();
    const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=30`;
    const response = await fetch(scUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      return res.json({ collection: [] });
    }

    const data: any = await response.json();
    const items = Array.isArray(data.collection) ? data.collection : [];

    // Score, normalize title/artist, and deduplicate multiple uploads of the same song
    const scoredCandidates: Array<{
      item: any;
      bestTc: any;
      parsed: { title: string; artist: string };
      durSec: number;
      score: number;
      dedupKey: string;
    }> = [];

    for (const item of items) {
      const bestTc = pickBestSoundCloudTranscoding(item);
      if (!bestTc) continue;

      const durSec = Math.round((item.duration || 0) / 1000);
      if (durSec < 65) continue;

      const pubArtist = item.publisher_metadata?.artist || '';
      const parsed = parseCanonicalTitleAndArtist(
        item.title || '',
        item.user?.username || '',
        pubArtist,
        query
      );

      const isProgressive = bestTc.format?.protocol === 'progressive';
      const score = scoreStreamCandidate({
        title: parsed.title,
        artist: parsed.artist,
        rawTitle: item.title || '',
        durationSeconds: durSec,
        query,
        qualityTier: isProgressive ? 'sc_progressive' : 'sc_hls',
        playCount: item.playback_count || 0
      });

      if (score < 0) continue;

      const dedupKey = `${normalizeTokenString(parsed.title)}___${normalizeTokenString(parsed.artist)}`;
      scoredCandidates.push({
        item,
        bestTc,
        parsed,
        durSec,
        score,
        dedupKey
      });
    }

    // Sort highest relevance & quality first, then deduplicate so only the #1 best master upload of each song is kept
    scoredCandidates.sort((a, b) => b.score - a.score);
    const uniqueCandidates: typeof scoredCandidates = [];
    const seenKeys = new Set<string>();
    for (const cand of scoredCandidates) {
      if (!seenKeys.has(cand.dedupKey)) {
        seenKeys.add(cand.dedupKey);
        uniqueCandidates.push(cand);
      }
      if (uniqueCandidates.length >= 15) break;
    }

    const resolvedItems = uniqueCandidates.map(({ item, bestTc, parsed, durSec, score }) => {
      rememberScTranscoding(item, bestTc);
      return {
        id: `sc-${item.id}`,
        title: parsed.title,
        artist: parsed.artist,
        album: item.publisher_metadata?.album_title || parsed.title,
        genre: item.genre || 'Studio Stream',
        year: item.release_date
          ? String(new Date(item.release_date).getFullYear())
          : item.created_at
          ? String(new Date(item.created_at).getFullYear())
          : '2024',
        durationSeconds: durSec,
        artwork: (item.artwork_url || item.user?.avatar_url || '').replace('-large', '-t500x500'),
        streamUrl: `/api/sc-stream?id=${encodeURIComponent(String(item.id))}`,
        source: 'SoundCloud',
        permalink: item.permalink_url,
        score
      };
    });

    res.json({
      collection: resolvedItems
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, collection: [] });
  }
});

// API 3B: JioSaavn 320kbps Full Studio Search + Internet Archive Studio Master + Audius Full Track Search
app.get('/api/full-stream-catalog', async (req, res) => {
  try {
    const rawQuery = String(req.query.q || req.query.query || '').trim();
    const query = expandMusicSearchQuery(rawQuery);
    if (!query) {
      return res.json({ results: [] });
    }

    const tracks: any[] = [];

    const [saavnSettled, archiveSettled, audiusSettled] = await Promise.allSettled([
      fetch(
        `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=12&p=1&q=${encodeURIComponent(query)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(4500)
        }
      ).then((r) => (r.ok ? r.json() : null)),
      searchArchiveOrgStudioAudio(query),
      fetch('https://api.audius.co', { signal: AbortSignal.timeout(3000) })
        .then((r) => (r.ok ? r.json() : null))
        .then(async (hosts: any) => {
          const host = hosts?.data?.[0];
          if (!host) return null;
          const r = await fetch(
            `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=AudioVido`,
            { signal: AbortSignal.timeout(4000) }
          );
          if (!r.ok) return null;
          const d: any = await r.json();
          return { host, items: d?.data || [] };
        })
    ]);

    if (saavnSettled.status === 'fulfilled' && Array.isArray(saavnSettled.value?.results)) {
      for (const item of saavnSettled.value.results) {
        const dur = Number(item.more_info?.duration || 0);
        const rawTitle = String(item.title || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        const primaryArtists =
          item.more_info?.artistMap?.primary_artists?.map((a: any) => a.name).join(', ') ||
          item.subtitle ||
          'Studio Artist';

        if (dur >= 65 && item.more_info?.encrypted_media_url) {
          const score = scoreStreamCandidate({
            title: rawTitle,
            artist: primaryArtists,
            rawTitle: `${rawTitle} ${primaryArtists}`,
            durationSeconds: dur,
            query,
            qualityTier: 'saavn_320',
            playCount: Number(item.play_count || 0)
          });

          if (score > 0) {
            const streamUrl = decryptJioSaavnStreamUrl(
              item.more_info.encrypted_media_url,
              item.more_info['320kbps'] === 'true'
            );
            if (streamUrl) {
              tracks.push({
                id: `saavn-${item.id}`,
                title: rawTitle,
                artist: primaryArtists,
                album: item.more_info?.album || rawTitle,
                genre: item.language
                  ? `${item.language.charAt(0).toUpperCase()}${item.language.slice(1)}`
                  : 'Studio 320kbps Master',
                year: item.year || '2024',
                durationSeconds: dur,
                artwork: String(item.image || '').replace('150x150', '500x500'),
                streamUrl,
                source: 'Saavn',
                score
              });
            }
          }
        }
      }
    }

    if (archiveSettled.status === 'fulfilled' && Array.isArray(archiveSettled.value)) {
      for (const archTrack of archiveSettled.value.slice(0, 8)) {
        tracks.push(archTrack);
      }
    }

    if (audiusSettled.status === 'fulfilled' && audiusSettled.value?.items) {
      const { host, items } = audiusSettled.value;
      for (const item of items.slice(0, 8)) {
        const dur = Number(item.duration || 0);
        if (dur >= 65 && item.id) {
          const parsed = parseCanonicalTitleAndArtist(
            item.title || '',
            item.user?.name || '',
            undefined,
            query
          );
          const score = scoreStreamCandidate({
            title: parsed.title,
            artist: parsed.artist,
            rawTitle: item.title || '',
            durationSeconds: dur,
            query,
            qualityTier: 'audius_320',
            playCount: Number(item.play_count || 0)
          });
          if (score > 0) {
            tracks.push({
              id: `audius-${item.id}`,
              title: parsed.title,
              artist: parsed.artist,
              album: item.mood || parsed.title,
              genre: item.genre || 'Electronic / Pop',
              year: item.release_date ? String(new Date(item.release_date).getFullYear()) : '2024',
              durationSeconds: dur,
              artwork: item.artwork?.['480x480'] || item.artwork?.['150x150'] || '',
              streamUrl: `${host}/v1/tracks/${item.id}/stream?app_name=AudioVido`,
              source: 'Audius',
              score
            });
          }
        }
      }
    }

    tracks.sort((a, b) => (b.score || 0) - (a.score || 0));
    res.json({ results: tracks });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, results: [] });
  }
});

// API 3C: Native Full-Length SoundCloud fMP4/MP3 Stream Endpoint with Byte-Range Support
app.get('/api/sc-stream', async (req, res) => {
  try {
    const rawId = String(req.query.id || '').replace(/^sc-/, '').trim();
    const tcUrl = String(req.query.tcUrl || '').trim();
    if (!rawId && !tcUrl) {
      return res.status(400).send('Missing SoundCloud track id');
    }

    const audioData = await getOrDownloadSoundCloudStream(rawId, tcUrl);
    if (!audioData || !audioData.buffer || audioData.buffer.length === 0) {
      return res.status(404).send('Full audio stream not available');
    }

    const totalLength = audioData.buffer.length;
    res.setHeader('Content-Type', audioData.contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? Math.min(parseInt(parts[1], 10), totalLength - 1) : totalLength - 1;

      if (start >= totalLength || start > end) {
        res.setHeader('Content-Range', `bytes */${totalLength}`);
        return res.status(416).end();
      }

      const chunkLength = end - start + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${totalLength}`);
      res.setHeader('Content-Length', String(chunkLength));
      return res.end(audioData.buffer.subarray(start, end + 1));
    }

    res.status(200);
    res.setHeader('Content-Length', String(totalLength));
    return res.end(audioData.buffer);
  } catch (e: any) {
    res.status(502).send('Error streaming SoundCloud audio: ' + (e?.message || e));
  }
});

// API 4: Live Audio Stream Proxy
app.get('/api/audio-proxy', async (req, res) => {
  try {
    const targetUrl = String(req.query.url || '');
    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ...(req.headers.range ? { Range: req.headers.range } : {})
      }
    });

    res.status(response.status);
    response.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    if (response.body) {
      Readable.fromWeb(response.body as any).pipe(res);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      res.end(Buffer.from(arrayBuffer));
    }
  } catch (e: any) {
    res.status(502).send('Audio proxy error: ' + (e?.message || e));
  }
});

// ==========================================================================
// API 7: UNIVERSAL OPENSUBTITLES EXTRACTION & WEBVTT PROXY
// ==========================================================================
app.get('/api/subtitles/resolve', async (req, res) => {
  try {
    const type = req.query.type === 'series' ? 'series' : 'movie';
    const imdbId = String(req.query.imdbId || 'tt0816692');
    const season = req.query.season ? String(req.query.season) : '1';
    const episode = req.query.episode ? String(req.query.episode) : '1';

    const targetId = type === 'series' ? `${imdbId}:${season}:${episode}` : imdbId;
    const requestUrl = `https://opensubtitles-v3.strem.io/subtitles/${type}/${targetId}.json`;

    const subRes = await fetch(requestUrl, { signal: AbortSignal.timeout(3500) });
    if (!subRes.ok) return res.json({ subtitles: [] });

    const data: any = await subRes.json();
    if (!data || !Array.isArray(data.subtitles)) return res.json({ subtitles: [] });

    const tracks: any[] = [];

    // Find Persian (OpenSubtitles uses 'per', 'fas', or 'fa')
    const faMatch = data.subtitles.find((sub: any) => sub.lang === 'per' || sub.lang === 'fas' || sub.lang === 'fa');
    if (faMatch && faMatch.url) {
      tracks.push({
        id: `fa-${faMatch.id || 'default'}`,
        lang: 'fa',
        label: 'فارسی (Persian)',
        url: `/api/subtitles/proxy?url=${encodeURIComponent(faMatch.url)}`,
        rawUrl: faMatch.url,
        default: true
      });
    }

    // Find English (OpenSubtitles uses 'eng' or 'en')
    const enMatch = data.subtitles.find((sub: any) => sub.lang === 'eng' || sub.lang === 'en');
    if (enMatch && enMatch.url) {
      tracks.push({
        id: `en-${enMatch.id || 'default'}`,
        lang: 'en',
        label: 'English (EN)',
        url: `/api/subtitles/proxy?url=${encodeURIComponent(enMatch.url)}`,
        rawUrl: enMatch.url,
        default: false
      });
    }

    res.json({ subtitles: tracks });
  } catch (e: any) {
    res.json({ subtitles: [] });
  }
});

// Proxy and convert any remote SRT/VTT subtitle to clean WebVTT
app.get('/api/subtitles/proxy', async (req, res) => {
  const targetUrl = String(req.query.url || '');
  if (!targetUrl) return res.status(400).send('Missing url parameter');

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const rawText = await upstream.text();
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (rawText.trim().startsWith('WEBVTT')) {
      return res.send(rawText);
    }

    // Convert SubRip (SRT) format to WebVTT
    let vtt = 'WEBVTT\n\n';
    vtt += rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');

    return res.send(vtt);
  } catch (e: any) {
    res.status(502).send('Error proxying subtitle: ' + (e?.message || e));
  }
});

// Open-licensed video search, resolve and live TV
registerVideoRoutes(app);

// Full-Stack Server Mount: Vite in Dev / Static in Prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AudioVido Server running on http://0.0.0.0:${PORT} [mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
