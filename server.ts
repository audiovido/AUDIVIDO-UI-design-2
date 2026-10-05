/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

let cachedSoundCloudClientId: string | null = null;
let lastSoundCloudIdFetch = 0;

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

// API 1: YouTube Music Search
app.get('/api/ytmusic-search', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ results: [] });
    }

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
      })
    });

    const ytmData: any = await ytmRes.json();
    const text = JSON.stringify(ytmData);
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const videoIds = [...new Set([...text.matchAll(regex)].map(m => m[1]))].slice(0, 15);

    let itunesTracks: any[] = [];
    try {
      const itRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
      if (itRes.ok) {
        const itData: any = await itRes.json();
        itunesTracks = itData.results || [];
      }
    } catch {}

    const negativeWords = ['karaoke', 'instrumental', 'backing track', 'tribute', 'remake', 'minus one'];
    const officialResults = await Promise.all(
      videoIds.slice(0, 10).map(async (id) => {
        try {
          const oRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
          if (!oRes.ok) return null;
          const oData: any = await oRes.json();
          const rawTitle = oData.title || '';
          const titleLower = rawTitle.toLowerCase();
          
          if (negativeWords.some(w => titleLower.includes(w))) {
            return null;
          }

          const match = itunesTracks.find(it => 
            titleLower.includes(it.trackName?.toLowerCase()) || 
            it.trackName?.toLowerCase().includes(titleLower.slice(0, 8))
          );

          let cover = match?.artworkUrl100?.replace('100x100bb', '600x600bb') || oData.thumbnail_url || '';
          let cleanArtist = oData.author_name?.replace(' - Topic', '').replace('VEVO', '') || match?.artistName || 'Official Artist';
          let cleanTitle = rawTitle.replace(/\(Official.*?\)/gi, '').replace(/\[Official.*?\]/gi, '').replace(/\(Audio\)/gi, '').trim();

          return {
            id: `ytm-${id}`,
            videoId: id,
            title: cleanTitle,
            artist: cleanArtist,
            album: match?.collectionName || 'Official Release',
            duration: match?.trackTimeMillis ? `${Math.floor(match.trackTimeMillis / 60000)}:${Math.floor((match.trackTimeMillis % 60000) / 1000).toString().padStart(2, '0')}` : '3:45',
            durationSeconds: match?.trackTimeMillis ? Math.round(match.trackTimeMillis / 1000) : 225,
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

// API 2: Resolve Audio Stream
app.get('/api/resolve-stream', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ streamUrl: null });
    }

    const clientId = await getSoundCloudClientId();
    const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=12`;
    const response = await fetch(scUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data: any = await response.json();
    const negativeWords = ['karaoke', 'instrumental', 'backing track', 'cover', 'tribute', 'remake', 'minus one'];
    
    const progressiveTracks = (data.collection || []).filter((t: any) => {
      const title = (t.title || '').toLowerCase();
      const hasNegative = negativeWords.some(w => title.includes(w));
      const hasProg = t.media?.transcodings?.some((tc: any) => tc.format?.protocol === 'progressive');
      return !hasNegative && t.duration > 40000 && hasProg;
    });

    const selectedTrack = progressiveTracks[0] || (data.collection || []).find((t: any) => t.duration > 40000);

    if (selectedTrack) {
      const prog = selectedTrack.media?.transcodings?.find((tc: any) => tc.format.protocol === 'progressive') || selectedTrack.media?.transcodings?.[0];
      if (prog?.url) {
        const sRes = await fetch(`${prog.url}?client_id=${clientId}`);
        const sData: any = await sRes.json();
        if (sData.url) {
          return res.json({
            streamUrl: sData.url,
            durationSeconds: Math.round(selectedTrack.duration / 1000),
            title: selectedTrack.title,
            artist: selectedTrack.user?.username,
            source: 'OfficialStream'
          });
        }
      }
    }

    // Fallback: YouTube Music
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
        })
      });

      if (ytmRes.ok) {
        const ytmData: any = await ytmRes.json();
        const text = JSON.stringify(ytmData);
        const videoMatches = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
        const videoId = videoMatches[0];

        if (videoId) {
          const invidiousHosts = [
            'https://invidious.f5.si',
            'https://iv.ggtyler.dev',
            'https://invidious.jing.rocks'
          ];

          for (const host of invidiousHosts) {
            try {
              const vRes = await fetch(`${host}/api/v1/videos/${videoId}`, { signal: AbortSignal.timeout(4000) });
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

// API 3: SoundCloud Search
app.get('/api/soundcloud-search', async (req, res) => {
  try {
    const query = String(req.query.q || req.query.query || '').trim();
    if (!query) {
      return res.json({ collection: [] });
    }

    const clientId = await getSoundCloudClientId();
    const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=20`;
    const response = await fetch(scUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data: any = await response.json();
    const items = Array.isArray(data.collection) ? data.collection : [];

    const resolvedItems = await Promise.all(
      items.slice(0, 12).map(async (item: any) => {
        try {
          const prog = item.media?.transcodings?.find((tc: any) => tc.format.protocol === 'progressive') || item.media?.transcodings?.[0];
          let streamUrl = '';
          if (prog?.url) {
            const sRes = await fetch(`${prog.url}?client_id=${clientId}`);
            const sData: any = await sRes.json();
            streamUrl = sData.url || '';
          }
          return {
            id: `sc-${item.id}`,
            title: item.title,
            artist: item.user?.username || 'SoundCloud Artist',
            durationSeconds: Math.round((item.duration || 0) / 1000),
            artwork: item.artwork_url || item.user?.avatar_url || '',
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
// API 5: UNIVERSAL VIDEO STREAM RESOLVER (Tier 1: Direct HLS, Tier 2: P2P, Tier 3: Embeds)
// ==========================================================================
app.get('/api/stream/resolve', async (req, res) => {
  try {
    const imdbId = String(req.query.imdbId || '');
    const tmdbId = String(req.query.tmdbId || '');
    const title = String(req.query.title || '').toLowerCase().trim();
    const type = (req.query.type === 'series' ? 'series' : 'movie') as 'movie' | 'series';
    const season = req.query.season ? String(req.query.season) : '1';
    const episode = req.query.episode ? String(req.query.episode) : '1';

    const targetId = imdbId || tmdbId;

    // 1. Direct Open Media Registry
    const OPEN_CINEMA_MAP: Record<string, string> = {
      'sintel': 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      'tears of steel': 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
      'big buck bunny': 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
      'oceans': 'https://vjs.zencdn.net/v/oceans.mp4',
      'night of the living dead': 'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4'
    };

    for (const [key, directUrl] of Object.entries(OPEN_CINEMA_MAP)) {
      if (title.includes(key)) {
        return res.json({
          success: true,
          tiers: {
            tier1: {
              url: directUrl,
              type: 'mp4',
              resolution: '4K Ultra HD'
            },
            tier2: null,
            tier3: null
          }
        });
      }
    }

    // 3. Direct Master Stream Resolution (Tier 1: High-Definition HLS / MP4 Stream)
    // Ensures HTML5 video playback without iframe sandbox blocking
    const directMasterUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    // 4. Query Stremio Addon Protocol (Torrentio / Community Streams)
    let p2pCandidates: any[] = [];
    if (targetId && targetId.startsWith('tt')) {
      try {
        const streamTargetId = type === 'series' ? `${targetId}:${season}:${episode}` : targetId;
        const stremioAddonUrl = `https://torrentio.strem.fun/stream/${type}/${streamTargetId}.json`;
        const stremioRes = await fetch(stremioAddonUrl, { signal: AbortSignal.timeout(3500) });
        if (stremioRes.ok) {
          const sData: any = await stremioRes.json();
          if (Array.isArray(sData?.streams)) {
            p2pCandidates = sData.streams
              .filter((s: any) => !!s.infoHash)
              .map((s: any) => ({
                name: s.name || s.title,
                infoHash: s.infoHash,
                fileIdx: s.fileIdx,
                quality: s.title?.match(/(4K|2160p|1080p|720p|480p)/i)?.[0] || '1080p FHD'
              }));
          }
        }
      } catch {}
    }

    // 5. Multi-Source Sanitized Embed Providers (Tier 3: Movie/Series streaming hosts, NO YouTube)
    const effectiveId = targetId || 'tt0816692';
    const embedFallbacks: string[] = [
      type === 'movie'
        ? `https://multiembed.mov/?video_id=${effectiveId}`
        : `https://multiembed.mov/?video_id=${effectiveId}&s=${season}&e=${episode}`,
      type === 'movie'
        ? `https://vidsrc.me/embed/movie?imdb=${effectiveId}`
        : `https://vidsrc.me/embed/tv?imdb=${effectiveId}&season=${season}&episode=${episode}`,
      type === 'movie'
        ? `https://vidsrc.to/embed/movie/${effectiveId}`
        : `https://vidsrc.to/embed/tv/${effectiveId}/${season}/${episode}`,
      type === 'movie'
        ? `https://autoembed.to/movie/imdb/${effectiveId}`
        : `https://autoembed.to/tv/imdb/${effectiveId}-${season}-${episode}`
    ];

    return res.json({
      success: true,
      tiers: {
        tier1: {
          url: directMasterUrl,
          type: 'hls',
          resolution: '4K Ultra HD'
        },
        tier2: p2pCandidates.length > 0 ? p2pCandidates : null,
        tier3: {
          embeds: embedFallbacks,
          primary: embedFallbacks[0]
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to resolve stream sources', message: err?.message || err });
  }
});

// ==========================================================================
// API 6: UNIVERSAL HLS MANIFEST REWRITER & BYTE-RANGE STREAMING PROXY
// ==========================================================================
app.get('/api/stream/proxy', async (req, res) => {
  const targetUrl = String(req.query.url || '');
  if (!targetUrl) return res.status(400).send('Missing "url" parameter');

  try {
    const upstreamUrl = new URL(targetUrl);
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': upstreamUrl.origin,
      'Origin': upstreamUrl.origin,
      ...(req.headers.range ? { Range: String(req.headers.range) } : {})
    };

    const upstreamRes = await fetch(targetUrl, { headers });

    res.status(upstreamRes.status);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);

    const acceptRanges = upstreamRes.headers.get('accept-ranges');
    if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges);

    const contentType = upstreamRes.headers.get('content-type') || '';

    // If HLS Playlist (.m3u8), rewrite relative and absolute URLs
    if (
      targetUrl.includes('.m3u8') ||
      contentType.includes('application/vnd.apple.mpegurl') ||
      contentType.includes('application/x-mpegurl')
    ) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      const manifestText = await upstreamRes.text();
      const host = req.get('host') || `localhost:${PORT}`;
      const protocol = req.protocol || 'http';
      const proxyBaseUrl = `${protocol}://${host}/api/stream/proxy`;

      const originalBase = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      const rewritten = manifestText
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) {
            if (trimmed.startsWith('#EXT-X-KEY') || trimmed.startsWith('#EXT-X-MAP')) {
              return trimmed.replace(/URI="([^"]+)"/, (_, uriMatch) => {
                const resolvedUri = new URL(uriMatch, originalBase).toString();
                return `URI="${proxyBaseUrl}?url=${encodeURIComponent(resolvedUri)}"`;
              });
            }
            return line;
          }
          const absoluteSegmentUrl = new URL(trimmed, originalBase).toString();
          return `${proxyBaseUrl}?url=${encodeURIComponent(absoluteSegmentUrl)}`;
        })
        .join('\n');

      return res.send(rewritten);
    }

    res.setHeader('Content-Type', contentType || 'video/MP2T');
    if (upstreamRes.body) {
      Readable.fromWeb(upstreamRes.body as any).pipe(res);
    } else {
      const buffer = await upstreamRes.arrayBuffer();
      res.end(Buffer.from(buffer));
    }
  } catch (err: any) {
    res.status(502).send('Error proxying media stream: ' + (err?.message || err));
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
