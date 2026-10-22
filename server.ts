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

function pickBestSoundCloudTranscoding(item: any): any | null {
  if (!item || item.policy === 'SNIP' || (item.duration || 0) < 60000) {
    return null;
  }
  const transcodings: any[] = Array.isArray(item.media?.transcodings) ? item.media.transcodings : [];
  // 1. Direct progressive MP3 stream
  const progressive = transcodings.find(
    (tc) => !tc.snipped && tc.format?.protocol === 'progressive'
  );
  if (progressive) return progressive;

  // 2. Unencrypted HLS fMP4/AAC stream (supported by Hls.js and Safari native audio)
  const unencryptedHlsMp4 = transcodings.find(
    (tc) =>
      !tc.snipped &&
      tc.format?.protocol === 'hls' &&
      !String(tc.format?.protocol || '').includes('encrypted') &&
      String(tc.format?.mime_type || '').includes('audio/mp4')
  );
  if (unencryptedHlsMp4) return unencryptedHlsMp4;

  // 3. Any other unencrypted non-mpegurl HLS transcoding
  const unencryptedHlsOther = transcodings.find(
    (tc) =>
      !tc.snipped &&
      tc.format?.protocol === 'hls' &&
      !String(tc.format?.protocol || '').includes('encrypted') &&
      !String(tc.format?.mime_type || '').includes('mpegurl')
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

// API 1: YouTube Music Search (Enriched with iTunes & Deezer Deep Metadata)
app.get('/api/ytmusic-search', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
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
      }).then(r => r.ok ? r.json() : null),
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`, {
        signal: AbortSignal.timeout(5000)
      }).then(r => r.ok ? r.json() : null),
      fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=15`, {
        signal: AbortSignal.timeout(5000)
      }).then(r => r.ok ? r.json() : null)
    ]);

    const ytmData: any = ytmSettled.status === 'fulfilled' ? ytmSettled.value : null;
    const text = ytmData ? JSON.stringify(ytmData) : '';
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const videoIds = [...new Set([...text.matchAll(regex)].map(m => m[1]))].slice(0, 15);

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
          
          if (negativeWords.some(w => titleLower.includes(w))) {
            return null;
          }

          let cleanTitle = rawTitle
            .replace(/\(Official.*?\)/gi, '')
            .replace(/\[Official.*?\]/gi, '')
            .replace(/\(Audio.*?\)/gi, '')
            .replace(/\[Audio.*?\]/gi, '')
            .replace(/\(Lyric.*?\)/gi, '')
            .replace(/\[Lyric.*?\]/gi, '')
            .replace(/\(HD\)|\(4K\)/gi, '')
            .trim();
          let cleanArtist = oData.author_name?.replace(' - Topic', '').replace(/VEVO$/i, '').trim() || 'Official Artist';

          // If title is formatted as "Artist - Song Title", split cleanly
          if (cleanTitle.includes(' - ')) {
            const parts = cleanTitle.split(' - ');
            if (parts.length === 2 && parts[0].length > 1 && parts[1].length > 1) {
              cleanArtist = parts[0].trim();
              cleanTitle = parts[1].trim();
            }
          }

          const normTitle = cleanTitle.toLowerCase();
          const match = itunesTracks.find(it => {
            const itTitle = (it.trackName || '').toLowerCase();
            return itTitle && (normTitle.includes(itTitle) || itTitle.includes(normTitle.slice(0, 10)));
          });

          const dzMatch = deezerTracks.find(dz => {
            const dzTitle = (dz.title || '').toLowerCase();
            return dzTitle && (normTitle.includes(dzTitle) || dzTitle.includes(normTitle.slice(0, 10)));
          });

          const cover =
            match?.artworkUrl100?.replace('100x100bb', '600x600bb') ||
            dzMatch?.album?.cover_xl ||
            dzMatch?.album?.cover_big ||
            oData.thumbnail_url ||
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

          const durationSec = match?.trackTimeMillis
            ? Math.round(match.trackTimeMillis / 1000)
            : (dzMatch?.duration || 215);
          const mins = Math.floor(durationSec / 60);
          const secs = durationSec % 60;
          const releaseYear = match?.releaseDate
            ? String(new Date(match.releaseDate).getFullYear())
            : '2024';

          return {
            id: `ytm-${id}`,
            videoId: id,
            title: match?.trackName || cleanTitle,
            artist: match?.artistName || dzMatch?.artist?.name || cleanArtist,
            album: match?.collectionName || dzMatch?.album?.title || 'Official Release',
            genre: match?.primaryGenreName || 'Official Master',
            year: releaseYear,
            duration: `${mins}:${secs.toString().padStart(2, '0')}`,
            durationSeconds: durationSec,
            coverUrl: cover,
            source: 'YouTubeMusic',
            isFullTrack: true
          };
        } catch {
          return null;
        }
      })
    );

    res.json({ results: officialResults.filter(Boolean) });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, results: [] });
  }
});

// API 2: Resolve Full-Length Audio Stream (SoundCloud Unencrypted Full -> JioSaavn 320kbps Full -> Audius Full -> YouTube Music / Invidious Full)
// Strictly NO 30-second demo previews!
app.get('/api/resolve-stream', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ streamUrl: null });
    }

    const negativeWords = ['karaoke', 'instrumental', 'backing track', 'tribute', 'minus one'];

    // Tier 1: SoundCloud full-length unencrypted stream (progressive or unencrypted HLS audio/mp4)
    try {
      const clientId = await getSoundCloudClientId();
      const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=20`;
      const response = await fetch(scUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(5500)
      });

      if (response.ok) {
        const data: any = await response.json();
        const rawCollection: any[] = Array.isArray(data.collection) ? data.collection : [];

        // Filter to full-length (>= 90s preferred, >= 60s minimum), non-SNIP, unencrypted tracks
        const playableTracks = rawCollection.filter((t: any) => {
          const title = (t.title || '').toLowerCase();
          const hasNegative = negativeWords.some((w) => title.includes(w));
          const bestTc = pickBestSoundCloudTranscoding(t);
          return !hasNegative && Boolean(bestTc);
        });

        // Prefer standard song lengths (90s to 600s) first so full songs rank above short clips or 1-hour mixes
        const standardLength = playableTracks.filter((t: any) => t.duration >= 90000 && t.duration <= 600000);
        const candidates = standardLength.length > 0 ? standardLength : playableTracks;

        for (const candidate of candidates.slice(0, 5)) {
          const bestTc = pickBestSoundCloudTranscoding(candidate);
          if (bestTc?.url) {
            const sRes = await fetch(`${bestTc.url}?client_id=${clientId}`, { signal: AbortSignal.timeout(4000) });
            if (sRes.ok) {
              const sData: any = await sRes.json();
              if (sData?.url) {
                return res.json({
                  streamUrl: sData.url,
                  durationSeconds: Math.round(candidate.duration / 1000),
                  title: candidate.title,
                  artist: candidate.user?.username,
                  source: 'SoundCloud'
                });
              }
            }
          }
        }
      }
    } catch {}

    // Tier 2: JioSaavn 320kbps Full-Length Direct MP4 Stream
    try {
      const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=10&p=1&q=${encodeURIComponent(query)}`;
      const saavnRes = await fetch(saavnUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(4500)
      });
      if (saavnRes.ok) {
        const saavnData: any = await saavnRes.json();
        const items: any[] = Array.isArray(saavnData.results) ? saavnData.results : [];
        for (const item of items) {
          const dur = Number(item.more_info?.duration || 0);
          const titleLower = String(item.title || '').toLowerCase();
          if (dur >= 65 && !negativeWords.some((w) => titleLower.includes(w)) && item.more_info?.encrypted_media_url) {
            const streamUrl = decryptJioSaavnStreamUrl(
              item.more_info.encrypted_media_url,
              item.more_info['320kbps'] === 'true'
            );
            if (streamUrl) {
              return res.json({
                streamUrl,
                durationSeconds: dur,
                title: item.title,
                artist: item.more_info?.artistMap?.primary_artists?.map((a: any) => a.name).join(', ') || item.subtitle,
                source: 'Saavn'
              });
            }
          }
        }
      }
    } catch {}

    // Tier 3: Audius Open Decentralized Full-Length MP3 Stream
    try {
      const auHostsRes = await fetch('https://api.audius.co', { signal: AbortSignal.timeout(3500) });
      if (auHostsRes.ok) {
        const auHosts: any = await auHostsRes.json();
        const host = auHosts?.data?.[0];
        if (host) {
          const auSearchRes = await fetch(
            `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=AudioVido`,
            { signal: AbortSignal.timeout(4000) }
          );
          if (auSearchRes.ok) {
            const auData: any = await auSearchRes.json();
            const match = (auData?.data || []).find((t: any) => (t.duration || 0) >= 65);
            if (match?.id) {
              return res.json({
                streamUrl: `${host}/v1/tracks/${match.id}/stream?app_name=AudioVido`,
                durationSeconds: match.duration || 180,
                title: match.title,
                artist: match.user?.name || 'Audius Artist',
                source: 'Audius'
              });
            }
          }
        }
      }
    } catch {}

    // Tier 4: YouTube Music + Invidious Full Audio Stream
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
                if (bestAudio?.url) {
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

// API 3: SoundCloud Full-Track Search (Only Unencrypted Full Tracks >= 60s, Never 30s Snippets)
app.get('/api/soundcloud-search', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ collection: [] });
    }

    const clientId = await getSoundCloudClientId();
    const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=25`;
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
    const playableItems = items.filter((item: any) => Boolean(pickBestSoundCloudTranscoding(item)));

    const resolvedItems = await Promise.all(
      playableItems.slice(0, 15).map(async (item: any) => {
        try {
          const bestTc = pickBestSoundCloudTranscoding(item);
          if (!bestTc?.url) return null;

          const sRes = await fetch(`${bestTc.url}?client_id=${clientId}`, { signal: AbortSignal.timeout(4000) });
          if (!sRes.ok) return null;
          const sData: any = await sRes.json();
          const streamUrl = sData?.url || '';
          if (!streamUrl) return null;

          return {
            id: `sc-${item.id}`,
            title: item.title,
            artist: item.user?.username || 'SoundCloud Artist',
            album: item.publisher_metadata?.album_title || 'SoundCloud Master',
            genre: item.genre || 'SoundCloud Global',
            year: item.release_date
              ? String(new Date(item.release_date).getFullYear())
              : item.created_at
              ? String(new Date(item.created_at).getFullYear())
              : '2024',
            durationSeconds: Math.round((item.duration || 0) / 1000),
            artwork: (item.artwork_url || item.user?.avatar_url || '').replace('-large', '-t500x500'),
            streamUrl: streamUrl,
            source: 'SoundCloud',
            permalink: item.permalink_url
          };
        } catch {
          return null;
        }
      })
    );

    res.json({ collection: resolvedItems.filter(Boolean) });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, collection: [] });
  }
});

// API 3B: JioSaavn 320kbps Full Studio Search + Audius Open Full Track Search
app.get('/api/full-stream-catalog', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ results: [] });
    }

    const negativeWords = ['karaoke', 'instrumental', 'backing track', 'tribute', 'minus one'];
    const tracks: any[] = [];

    const [saavnSettled, audiusSettled] = await Promise.allSettled([
      fetch(
        `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=12&p=1&q=${encodeURIComponent(query)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(4500)
        }
      ).then((r) => (r.ok ? r.json() : null)),
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
        if (dur >= 65 && !negativeWords.some((w) => rawTitle.toLowerCase().includes(w)) && item.more_info?.encrypted_media_url) {
          const streamUrl = decryptJioSaavnStreamUrl(
            item.more_info.encrypted_media_url,
            item.more_info['320kbps'] === 'true'
          );
          if (streamUrl) {
            const primaryArtists = item.more_info?.artistMap?.primary_artists?.map((a: any) => a.name).join(', ');
            tracks.push({
              id: `saavn-${item.id}`,
              title: rawTitle,
              artist: primaryArtists || item.subtitle || 'Studio Artist',
              album: item.more_info?.album || rawTitle,
              genre: item.language ? `${item.language.charAt(0).toUpperCase()}${item.language.slice(1)}` : 'Studio Master',
              year: item.year || '2024',
              durationSeconds: dur,
              artwork: String(item.image || '').replace('150x150', '500x500'),
              streamUrl,
              source: 'Saavn'
            });
          }
        }
      }
    }

    if (audiusSettled.status === 'fulfilled' && audiusSettled.value?.items) {
      const { host, items } = audiusSettled.value;
      for (const item of items.slice(0, 8)) {
        const dur = Number(item.duration || 0);
        if (dur >= 65 && item.id) {
          tracks.push({
            id: `audius-${item.id}`,
            title: item.title || 'Audius Track',
            artist: item.user?.name || 'Audius Artist',
            album: item.mood || 'Audius Stream',
            genre: item.genre || 'Electronic / Pop',
            year: item.release_date ? String(new Date(item.release_date).getFullYear()) : '2024',
            durationSeconds: dur,
            artwork: item.artwork?.['480x480'] || item.artwork?.['150x150'] || '',
            streamUrl: `${host}/v1/tracks/${item.id}/stream?app_name=AudioVido`,
            source: 'Audius'
          });
        }
      }
    }

    res.json({ results: tracks });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || e, results: [] });
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
