import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Readable } from 'stream';
import {defineConfig} from 'vite';

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

function audioProxyPlugin() {
  return {
    name: 'audio-stream-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/soundcloud-search', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url!, `http://${req.headers.host || 'localhost'}`);
          const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || '';
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (!query.trim()) {
            res.end(JSON.stringify({ collection: [] }));
            return;
          }

          const clientId = await getSoundCloudClientId();
          const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=20`;
          const response = await fetch(scUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const data = await response.json();
          const items = Array.isArray(data.collection) ? data.collection : [];

          // Map items and resolve progressive streams
          const resolvedItems = await Promise.all(
            items.slice(0, 12).map(async (item: any) => {
              try {
                const prog = item.media?.transcodings?.find((tc: any) => tc.format.protocol === 'progressive') || item.media?.transcodings?.[0];
                let streamUrl = '';
                if (prog?.url) {
                  const sRes = await fetch(`${prog.url}?client_id=${clientId}`);
                  const sData = await sRes.json();
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

          res.end(JSON.stringify({ collection: resolvedItems.filter(Boolean) }));
        } catch (e: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e?.message || e, collection: [] }));
        }
      });

      server.middlewares.use('/api/resolve-stream', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url!, `http://${req.headers.host || 'localhost'}`);
          const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || '';
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (!query.trim()) {
            res.end(JSON.stringify({ streamUrl: null }));
            return;
          }

          const clientId = await getSoundCloudClientId();
          const scUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=12`;
          const response = await fetch(scUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const data = await response.json();
          const negativeWords = ['karaoke', 'instrumental', 'backing track', 'cover', 'tribute', 'remake', 'minus one'];
          
          // Find progressive MP3 tracks first (Highest reliability for HTML5 audio)
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
              const sData = await sRes.json();
              if (sData.url) {
                res.end(JSON.stringify({
                  streamUrl: sData.url,
                  durationSeconds: Math.round(selectedTrack.duration / 1000),
                  title: selectedTrack.title,
                  artist: selectedTrack.user?.username,
                  source: 'OfficialStream'
                }));
                return;
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
              const ytmData = await ytmRes.json();
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
                      const vData = await vRes.json();
                      const audios = (vData.adaptiveFormats || []).filter((f: any) => f.type && f.type.startsWith('audio/'));
                      const bestAudio = audios[audios.length - 1] || audios[0];
                      if (bestAudio?.url) {
                        res.end(JSON.stringify({
                          streamUrl: `/api/audio-proxy?url=${encodeURIComponent(bestAudio.url)}`,
                          rawAudioUrl: bestAudio.url,
                          durationSeconds: vData.lengthSeconds || 180,
                          title: vData.title,
                          artist: vData.author,
                          source: 'YouTubeMusic'
                        }));
                        return;
                      }
                    }
                  } catch {}
                }
              }
            }
          } catch {}

          res.end(JSON.stringify({ streamUrl: null }));
        } catch (e: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e?.message || e, streamUrl: null }));
        }
      });
      server.middlewares.use('/api/ytmusic-search', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url!, `http://${req.headers.host || 'localhost'}`);
          const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || '';
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (!query.trim()) {
            res.end(JSON.stringify({ results: [] }));
            return;
          }

          // 1. Query YouTube Music API for official studio master songs
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

          const ytmData = await ytmRes.json();
          const text = JSON.stringify(ytmData);
          const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
          const videoIds = [...new Set([...text.matchAll(regex)].map(m => m[1]))].slice(0, 15);

          // 2. Query iTunes in parallel for high-res official artwork (600x600)
          let itunesTracks: any[] = [];
          try {
            const itRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
            if (itRes.ok) {
              const itData = await itRes.json();
              itunesTracks = itData.results || [];
            }
          } catch {}

          // 3. Resolve metadata for top official YouTube Music tracks
          const negativeWords = ['karaoke', 'instrumental', 'backing track', 'tribute', 'remake', 'minus one'];
          const officialResults = await Promise.all(
            videoIds.slice(0, 10).map(async (id) => {
              try {
                const oRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
                if (!oRes.ok) return null;
                const oData = await oRes.json();
                const rawTitle = oData.title || '';
                const titleLower = rawTitle.toLowerCase();
                
                // Exclude negative words
                if (negativeWords.some(w => titleLower.includes(w))) {
                  return null;
                }

                // Match with iTunes for pristine 600x600 cover
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

          res.end(JSON.stringify({ results: officialResults.filter(Boolean) }));
        } catch (e: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e?.message || e, results: [] }));
        }
      });

      server.middlewares.use('/api/audio-proxy', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url!, `http://${req.headers.host || 'localhost'}`);
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }

          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              ...(req.headers.range ? { Range: req.headers.range } : {})
            }
          });

          res.statusCode = response.status;
          response.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (response.body) {
            Readable.fromWeb(response.body as any).pipe(res);
          } else {
            const arrayBuffer = await response.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          }
        } catch (e: any) {
          res.statusCode = 502;
          res.end('Audio proxy error: ' + (e?.message || e));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), audioProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/deezer': {
          target: 'https://api.deezer.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/deezer/, '')
        }
      }
    },
  };
});
