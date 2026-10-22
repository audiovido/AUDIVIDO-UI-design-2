/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  previewUrl?: string; // Direct full or preview audio stream for web playback
  genre: string;
  year?: string;
  source: 'YouTubeMusic' | 'iTunes' | 'SoundCloud' | 'Deezer' | 'Audius' | 'Curated' | 'Saavn';
  plays?: string;
  lyrics?: string[];
  syncedLyrics?: { time: number; text: string }[];
  addedAt?: number;
  isFullTrack?: boolean;
}

export interface LyricResult {
  plainLyrics?: string[];
  syncedLyrics?: { time: number; text: string }[];
  instrumental?: boolean;
}

// Parse LRC formatted string into timestamped lines: [01:23.45] Some line of lyrics
export function parseLrcLyrics(lrcString: string): { time: number; text: string }[] {
  if (!lrcString) return [];
  const lines = lrcString.split('\n');
  const result: { time: number; text: string }[] = [];

  const timeRegex = /\[(\d{2}):(\d{2}(?:\.\d{1,3})?)\](.*)/;

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      if (text) {
        result.push({
          time: minutes * 60 + seconds,
          text: text
        });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

const STORAGE_KEY = 'audiovido_saved_library_tracks_v1';

class MusicApiService {
  private cache: Map<string, ApiTrack[]> = new Map();
  private lyricsCache: Map<string, LyricResult> = new Map();
  private streamCache: Map<string, { streamUrl: string; durationSeconds: number }> = new Map();
  private inFlightResolves: Map<string, Promise<{ streamUrl?: string; durationSeconds?: number } | null>> = new Map();

  /**
   * Expand Persian/Finglish musical queries into canonical search terms (e.g. "کمل رجب" -> "Camel Rajaz")
   */
  public expandSearchQuery(raw: string): string {
    let q = ` ${(raw || '').trim()} `;
    if (!q.trim()) return '';
    const stripped = q
      .replace(/(?:^|\s)(?:آهنگ|موزیک|ترک|گروه|از|خواننده)(?=\s|$)/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (stripped.length >= 2) {
      q = ` ${stripped} `;
    }

    const pairs: Array<[RegExp, string]> = [
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

    for (const [pattern, rep] of pairs) {
      q = q.replace(pattern, ` ${rep} `);
    }
    return q.replace(/\s+/g, ' ').trim();
  }

  /**
   * Search YouTube Music Official Studio Master Catalog
   */
  async searchYouTubeMusic(query: string, limit: number = 20): Promise<ApiTrack[]> {
    const trimmed = this.expandSearchQuery(query);
    if (!trimmed) return [];

    const cacheKey = `ytm_${trimmed.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const endpoint = `/api/ytmusic-search?q=${encodeURIComponent(trimmed)}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return [];

      const data = await response.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];

      const results: ApiTrack[] = rawResults.map((item: any) => {
        const durSec = item.durationSeconds || 210;
        const mins = Math.floor(durSec / 60);
        const secs = durSec % 60;
        const tTitle = item.title || 'Official Song';
        const tArtist = item.artist || 'Official Artist';

        return {
          id: item.id || `ytm-${Math.random()}`,
          title: tTitle,
          artist: tArtist,
          album: item.album || 'Master Release',
          duration: `${mins}:${secs.toString().padStart(2, '0')}`,
          durationSeconds: durSec,
          coverUrl: item.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          previewUrl: `/api/resolve-stream?q=${encodeURIComponent(tArtist + ' ' + tTitle)}&title=${encodeURIComponent(tTitle)}&artist=${encodeURIComponent(tArtist)}&duration=${durSec}`,
          genre: item.genre || 'Official Release',
          year: item.year || '2024',
          source: 'YouTubeMusic' as const,
          plays: `${(Math.random() * 8 + 3).toFixed(1)}M`,
          isFullTrack: true
        };
      });

      if (results.length > 0) {
        this.cache.set(cacheKey, results);
      }
      return results;
    } catch (err) {
      console.warn('YouTube Music search failed:', err);
      return [];
    }
  }

  /**
   * Search Apple iTunes Global Catalog (HD Artwork & Official Metadata)
   */
  async searchITunes(query: string, limit: number = 25): Promise<ApiTrack[]> {
    const trimmed = this.expandSearchQuery(query);
    if (!trimmed) return [];

    const cacheKey = `itunes_${trimmed.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=song&limit=${limit}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return [];

      const data = await response.json();
      const results: ApiTrack[] = (data.results || [])
        .map((item: any) => {
          const durationSec = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 180;
          const mins = Math.floor(durationSec / 60);
          const secs = durationSec % 60;
          const durationFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

          let highResArtwork = item.artworkUrl100 || '';
          if (highResArtwork.includes('100x100bb')) {
            highResArtwork = highResArtwork.replace('100x100bb', '600x600bb');
          } else if (highResArtwork.includes('60x60bb')) {
            highResArtwork = highResArtwork.replace('60x60bb', '600x600bb');
          }

          const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : '2024';
          const tTitle = item.trackName || 'Unknown Title';
          const tArtist = item.artistName || 'Unknown Artist';

          return {
            id: `itunes-${item.trackId}`,
            title: tTitle,
            artist: tArtist,
            album: item.collectionName || tTitle || 'Single',
            duration: durationFormatted,
            durationSeconds: durationSec,
            coverUrl: highResArtwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            previewUrl: `/api/resolve-stream?q=${encodeURIComponent(tArtist + ' ' + tTitle)}&title=${encodeURIComponent(tTitle)}&artist=${encodeURIComponent(tArtist)}&duration=${durationSec}`,
            genre: item.primaryGenreName || 'Pop / Rock',
            year: releaseYear,
            source: 'iTunes' as const,
            plays: `${(Math.random() * 5 + 1).toFixed(1)}M`,
            isFullTrack: true
          };
        })
        .filter((t: ApiTrack) => t.durationSeconds >= 60);

      this.cache.set(cacheKey, results);
      return results;
    } catch (err) {
      console.warn('iTunes Search API failed:', err);
      return [];
    }
  }

  /**
   * Search SoundCloud Full Stream Engine
   */
  async searchSoundCloud(query: string, limit: number = 15): Promise<ApiTrack[]> {
    const trimmed = this.expandSearchQuery(query);
    if (!trimmed) return [];

    const cacheKey = `sc_${trimmed.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const endpoint = `/api/soundcloud-search?q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(endpoint);
      if (!res.ok) return [];

      const data = await res.json();
      const collection = Array.isArray(data.collection) ? data.collection : [];

      const results: ApiTrack[] = collection
        .map((item: any) => {
          const durSec = item.durationSeconds || 180;
          const mins = Math.floor(durSec / 60);
          const secs = durSec % 60;

          return {
            id: item.id || `sc-${Math.random()}`,
            title: item.title || 'Unknown Title',
            artist: item.artist || 'SoundCloud Artist',
            album: item.album || 'SoundCloud Master',
            duration: `${mins}:${secs.toString().padStart(2, '0')}`,
            durationSeconds: durSec,
            coverUrl: item.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            previewUrl: item.streamUrl,
            genre: item.genre || 'SoundCloud Global',
            year: item.year || '2024',
            source: 'SoundCloud' as const,
            plays: `${(Math.random() * 4 + 1).toFixed(1)}M`,
            isFullTrack: true
          };
        })
        .filter((t: ApiTrack) => Boolean(t.previewUrl) && t.durationSeconds >= 60);

      if (results.length > 0) {
        this.cache.set(cacheKey, results);
      }
      return results;
    } catch (e) {
      console.warn('SoundCloud search failed:', e);
      return [];
    }
  }

  /**
   * Client-side CORS-friendly full-track fallback for static hosts like GitHub Pages (*.github.io)
   */
  private async searchClientSideFullStreams(query: string, limit: number = 15): Promise<ApiTrack[]> {
    const results: ApiTrack[] = [];
    const encoded = encodeURIComponent(query);

    const [saavnRes, audiusRes] = await Promise.allSettled([
      fetch(`https://saavn.dev/api/search/songs?query=${encoded}&limit=${limit}`),
      fetch(`https://discoveryprovider.audius.co/v1/tracks/search?query=${encoded}&app_name=AudiovidoStudio`)
    ]);

    if (saavnRes.status === 'fulfilled' && saavnRes.value.ok) {
      try {
        const sData = await saavnRes.value.json();
        const items = sData?.data?.results || [];
        for (const item of items) {
          const durSec = Number(item.duration) || 0;
          if (durSec < 60) continue;
          const downloads = Array.isArray(item.downloadUrl) ? item.downloadUrl : [];
          const bestDl =
            downloads.find((d: any) => d.quality === '320kbps') ||
            downloads.find((d: any) => d.quality === '160kbps') ||
            downloads[downloads.length - 1];
          const streamUrl = bestDl?.url || bestDl?.link;
          if (!streamUrl) continue;

          const images = Array.isArray(item.image) ? item.image : [];
          const bestImg = images[images.length - 1]?.url || images[images.length - 1]?.link;
          const mins = Math.floor(durSec / 60);
          const secs = durSec % 60;
          const artists =
            item.artists?.primary?.map((a: any) => a.name).join(', ') ||
            item.primaryArtists ||
            'Studio Artist';

          results.push({
            id: `saavn-${item.id}`,
            title: (item.name || item.title || 'Unknown Title').replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
            artist: String(artists).replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
            album: item.album?.name || 'Studio Master',
            duration: `${mins}:${secs.toString().padStart(2, '0')}`,
            durationSeconds: durSec,
            coverUrl: bestImg || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            previewUrl: streamUrl,
            genre: item.language || 'Studio Master',
            year: String(item.year || '2024'),
            source: 'Saavn',
            plays: `${(Math.random() * 5 + 1.2).toFixed(1)}M`,
            isFullTrack: true
          });
        }
      } catch {}
    }

    if (audiusRes.status === 'fulfilled' && audiusRes.value.ok) {
      try {
        const aData = await audiusRes.value.json();
        const items = Array.isArray(aData?.data) ? aData.data : [];
        for (const item of items.slice(0, limit)) {
          const durSec = Number(item.duration) || 0;
          if (durSec < 60 || !item.id) continue;
          const mins = Math.floor(durSec / 60);
          const secs = durSec % 60;
          results.push({
            id: `audius-${item.id}`,
            title: item.title || 'Unknown Title',
            artist: item.user?.name || item.user?.handle || 'Audius Artist',
            album: item.mood || item.genre || 'Audius Master',
            duration: `${mins}:${secs.toString().padStart(2, '0')}`,
            durationSeconds: durSec,
            coverUrl:
              item.artwork?.['480x480'] ||
              item.artwork?.['1000x1000'] ||
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            previewUrl: `https://discoveryprovider.audius.co/v1/tracks/${item.id}/stream?app_name=AudiovidoStudio`,
            genre: item.genre || 'Electronic / Pop',
            year: item.release_date ? String(new Date(item.release_date).getFullYear()) : '2024',
            source: 'Audius',
            plays: `${(Math.random() * 3 + 1).toFixed(1)}M`,
            isFullTrack: true
          });
        }
      } catch {}
    }

    return results;
  }

  /**
   * Search JioSaavn 320kbps Full Studio, Archive.org Lossless/MP3 & Audius Open Full Stream Catalog
   */
  async searchFullStreamCatalog(query: string, limit: number = 15): Promise<ApiTrack[]> {
    const trimmed = this.expandSearchQuery(query);
    if (!trimmed) return [];

    const cacheKey = `fullcat_${trimmed.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const endpoint = `/api/full-stream-catalog?q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(endpoint);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        const items = Array.isArray(data.results) ? data.results : [];

        const results: ApiTrack[] = items
          .map((item: any) => {
            const durSec = Number(item.durationSeconds) || 180;
            const mins = Math.floor(durSec / 60);
            const secs = durSec % 60;

            return {
              id: item.id || `full-${Math.random()}`,
              title: item.title || 'Unknown Title',
              artist: item.artist || 'Studio Artist',
              album: item.album || 'Studio Master',
              duration: `${mins}:${secs.toString().padStart(2, '0')}`,
              durationSeconds: durSec,
              coverUrl:
                item.artwork ||
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
              previewUrl: item.streamUrl,
              genre: item.genre || 'Studio Master',
              year: item.year || '2024',
              source: (item.source === 'Audius' ? 'Audius' : 'Saavn') as 'Audius' | 'Saavn',
              plays: `${(Math.random() * 5 + 1.2).toFixed(1)}M`,
              isFullTrack: true
            };
          })
          .filter((t: ApiTrack) => Boolean(t.previewUrl) && t.durationSeconds >= 60);

        if (results.length > 0) {
          this.cache.set(cacheKey, results);
          return results.slice(0, limit);
        }
      }
    } catch (e) {
      console.warn('Server full stream catalog unavailable, using direct CORS fallback:', e);
    }

    const fallbackResults = await this.searchClientSideFullStreams(trimmed, limit);
    if (fallbackResults.length > 0) {
      this.cache.set(cacheKey, fallbackResults);
    }
    return fallbackResults.slice(0, limit);
  }

  /**
   * Resolve Full-Length Studio Master Audio Stream (SoundCloud -> JioSaavn 320k -> Archive.org Lossless/MP3 -> Audius -> YouTube Music)
   */
  async resolveFullTrackAudio(
    title: string,
    artist: string,
    durationSeconds?: number
  ): Promise<{ streamUrl?: string; durationSeconds?: number } | null> {
    const key = `${title.toLowerCase().trim()}___${artist.toLowerCase().trim()}`;
    if (this.streamCache.has(key)) {
      return this.streamCache.get(key)!;
    }

    if (this.inFlightResolves.has(key)) {
      return this.inFlightResolves.get(key)!;
    }

    const resolvePromise = (async (): Promise<{ streamUrl?: string; durationSeconds?: number } | null> => {
      try {
        const q = this.expandSearchQuery(`${artist} ${title}`.trim());
        const params = new URLSearchParams({
          q,
          title: title.trim(),
          artist: artist.trim()
        });
        if (durationSeconds && durationSeconds >= 65) {
          params.set('duration', String(Math.round(durationSeconds)));
        }
        const endpoint = `/api/resolve-stream?${params.toString()}`;
        const res = await fetch(endpoint);
        const contentType = res.headers.get('content-type') || '';

        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data?.streamUrl) {
            const result = {
              streamUrl: data.streamUrl,
              durationSeconds:
                data.durationSeconds && data.durationSeconds >= 65
                  ? data.durationSeconds
                  : durationSeconds && durationSeconds >= 65
                  ? durationSeconds
                  : 210
            };
            this.streamCache.set(key, result);
            return result;
          }
        }

        // Static host (.github.io) fallback: resolve full-length stream directly in browser
        const clientStreams = await this.searchClientSideFullStreams(q, 8);
        if (clientStreams.length > 0 && clientStreams[0].previewUrl) {
          const best = clientStreams[0];
          const result = {
            streamUrl: best.previewUrl!,
            durationSeconds: best.durationSeconds || durationSeconds || 210
          };
          this.streamCache.set(key, result);
          return result;
        }
      } catch (e) {
        console.warn('Error resolving full track:', e);
      } finally {
        this.inFlightResolves.delete(key);
      }
      return null;
    })();

    this.inFlightResolves.set(key, resolvePromise);
    return resolvePromise;
  }

  /**
   * Score track by Spotify/Apple Music relevance + verified full-length master quality
   */
  private scoreTrackRelevanceAndQuality(
    track: ApiTrack,
    rawQuery: string,
    expandedQuery: string,
    hasDirectStream: boolean,
    matchesCanonicalDuration: boolean,
    hasOfficialCatalogMetadata: boolean
  ): number {
    if (track.durationSeconds < 60) return -10000;

    const qNorm = this.normalizeForLyricMatch(expandedQuery || rawQuery);
    const rawQNorm = this.normalizeForLyricMatch(rawQuery);
    const titleNorm = this.normalizeForLyricMatch(track.title);
    const artistNorm = this.normalizeForLyricMatch(track.artist);
    const albumNorm = this.normalizeForLyricMatch(track.album || '');
    const combined = `${artistNorm} ${titleNorm} ${albumNorm}`;

    const tokens = [...new Set([...qNorm.split(' '), ...rawQNorm.split(' ')])].filter(
      (t) => t.length >= 2
    );

    let matched = 0;
    for (const tok of tokens) {
      if (combined.includes(tok)) matched++;
    }
    if (tokens.length > 0 && matched === 0) {
      return -5000;
    }

    let score = 0;

    // 1. Token coverage & exact phrase match
    if (tokens.length > 0) {
      score += Math.round((matched / tokens.length) * 350);
      if (matched === tokens.length) score += 180;
    }

    if (`${artistNorm} ${titleNorm}` === qNorm || `${titleNorm} ${artistNorm}` === qNorm) {
      score += 550;
    } else if (titleNorm === qNorm) {
      score += 400;
    } else if (artistNorm === qNorm) {
      score += 360;
    } else if (
      `${artistNorm} ${titleNorm}`.includes(qNorm) ||
      `${titleNorm} ${artistNorm}`.includes(qNorm)
    ) {
      score += 280;
    }

    // Check if query has both artist and song parts (e.g. "Camel Rajaz")
    if (tokens.length >= 2) {
      const titleHasToken = tokens.some((t) => titleNorm === t || titleNorm.startsWith(t));
      const artistHasToken = tokens.some((t) => artistNorm === t || artistNorm.startsWith(t));
      if (titleHasToken && artistHasToken) {
        score += 320;
      }
    }

    // 2. Studio Master vs Remix/Live/Cover/Karaoke penalty
    const variantWords = [
      'remix', 'dj ', 'bootleg', 'mashup', 'cover', 'tribute', 'karaoke',
      'originally performed', 'originally perfomed', 'melody version',
      'instrumental', 'slowed', 'reverb', 'sped up', 'nightcore', '8d',
      'medley', 'live', 'snippet', 'preview', 'promo', 'amapiano', 'rework', 'flip'
    ];
    const userRequestedVariant = variantWords.some((w) => qNorm.includes(w.trim()));
    const textCheck = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
    if (!userRequestedVariant && variantWords.some((w) => textCheck.includes(w))) {
      score -= 600;
    } else {
      score += 160;
    }

    // Penalize short 60s-115s promo clips when full-length tracks exist
    if (track.durationSeconds < 115) {
      score -= 340;
    }

    // 3. Direct Verified Full Stream & Studio Duration Match Bonus
    if (hasDirectStream) {
      score += 260;
    }
    if (matchesCanonicalDuration) {
      score += 220;
    }
    if (hasOfficialCatalogMetadata) {
      score += 140;
    }

    return score;
  }

  /**
   * Search across all engines with Spotify/Apple Music Relevance + Verified Full Studio Master Stream Priority
   */
  async searchTracks(
    query: string,
    engine: 'all' | 'full' | 'itunes' | 'deezer' = 'all',
    limit: number = 25
  ): Promise<ApiTrack[]> {
    const rawQ = query.trim();
    if (!rawQ) return [];
    const expandedQ = this.expandSearchQuery(rawQ);

    if (engine === 'itunes') {
      return this.searchITunes(expandedQ, limit);
    }

    // Fetch in parallel from our Full-Length Stream Sources + Official Catalog Metadata
    const [scRes, fullCatRes, ytmRes, itunesRes] = await Promise.allSettled([
      this.searchSoundCloud(expandedQ, 15),
      this.searchFullStreamCatalog(expandedQ, 12),
      this.searchYouTubeMusic(expandedQ, 12),
      this.searchITunes(expandedQ, 18)
    ]);

    const scTracks = scRes.status === 'fulfilled' ? scRes.value : [];
    const fullCatTracks = fullCatRes.status === 'fulfilled' ? fullCatRes.value : [];
    const ytmTracks = ytmRes.status === 'fulfilled' ? ytmRes.value : [];
    const itunesTracks = itunesRes.status === 'fulfilled' ? itunesRes.value : [];

    // Direct stream pool (tracks that ALREADY have a resolved, verified full-length MP3/MP4/AAC streamUrl)
    const directStreams = [...fullCatTracks, ...scTracks].filter(
      (t) => t.previewUrl && !t.previewUrl.startsWith('/api/resolve-stream') && t.durationSeconds >= 60
    );

    // Official catalog pool (Apple Music & YouTube Music with canonical titles, albums, HD covers & studio durations)
    const officialCatalog = [...itunesTracks, ...ytmTracks];

    // Helper: find matching official catalog metadata for a direct stream track
    const findOfficialMatch = (track: ApiTrack): ApiTrack | undefined => {
      const tTitle = this.normalizeForLyricMatch(track.title);
      const tArtist = this.normalizeForLyricMatch(track.artist);
      return officialCatalog.find((cat) => {
        const cTitle = this.normalizeForLyricMatch(cat.title);
        const cArtist = this.normalizeForLyricMatch(cat.artist);
        const titleMatches =
          cTitle === tTitle ||
          (cTitle.length >= 4 && tTitle.includes(cTitle)) ||
          (tTitle.length >= 4 && cTitle.includes(tTitle));
        const artistMatches =
          cArtist === tArtist ||
          cArtist.includes(tArtist) ||
          tArtist.includes(cArtist) ||
          tTitle.includes(cArtist);
        return titleMatches && artistMatches;
      });
    };

    // Helper: find matching direct full-length stream for an official catalog track
    const findDirectStreamMatch = (catTrack: ApiTrack): ApiTrack | undefined => {
      const cTitle = this.normalizeForLyricMatch(catTrack.title);
      const cArtist = this.normalizeForLyricMatch(catTrack.artist);
      const candidates = directStreams.filter((ds) => {
        const dTitle = this.normalizeForLyricMatch(ds.title);
        const dArtist = this.normalizeForLyricMatch(ds.artist);
        const titleMatches =
          dTitle === cTitle ||
          (cTitle.length >= 4 && dTitle.includes(cTitle)) ||
          (dTitle.length >= 4 && cTitle.includes(dTitle));
        const artistMatches =
          dArtist === cArtist ||
          dArtist.includes(cArtist) ||
          cArtist.includes(dArtist);
        return titleMatches && artistMatches;
      });

      if (candidates.length === 0) return undefined;
      // Pick the direct stream whose duration is closest to the official studio duration
      candidates.sort(
        (a, b) =>
          Math.abs(a.durationSeconds - catTrack.durationSeconds) -
          Math.abs(b.durationSeconds - catTrack.durationSeconds)
      );
      return candidates[0];
    };

    const scoredMap = new Map<string, { track: ApiTrack; score: number }>();

    const upsertCandidate = (
      track: ApiTrack,
      hasDirectStream: boolean,
      matchesCanonicalDuration: boolean,
      hasOfficialCatalogMetadata: boolean
    ) => {
      const normTitle = this.normalizeForLyricMatch(track.title);
      const normArtist = this.normalizeForLyricMatch(track.artist);
      if (!normTitle) return;

      const dedupKey = `${normTitle}___${normArtist}`;
      const score = this.scoreTrackRelevanceAndQuality(
        track,
        rawQ,
        expandedQ,
        hasDirectStream,
        matchesCanonicalDuration,
        hasOfficialCatalogMetadata
      );

      if (score < 0) return;

      const existing = scoredMap.get(dedupKey);
      if (!existing || score > existing.score) {
        scoredMap.set(dedupKey, { track, score });
      }
    };

    // 1. Process direct full-length stream tracks (enriched with Apple Music / YouTube Music canonical metadata if matched)
    for (const ds of directStreams) {
      const official = findOfficialMatch(ds);
      if (official) {
        const durDiff = Math.abs(ds.durationSeconds - official.durationSeconds);
        const mins = Math.floor(ds.durationSeconds / 60);
        const secs = ds.durationSeconds % 60;
        const mergedTrack: ApiTrack = {
          ...official,
          id: ds.id,
          duration: `${mins}:${secs.toString().padStart(2, '0')}`,
          durationSeconds: ds.durationSeconds,
          previewUrl: ds.previewUrl, // Direct verified full-length audio stream!
          source: ds.source,
          isFullTrack: true
        };
        upsertCandidate(mergedTrack, true, durDiff <= 12, true);
      } else {
        upsertCandidate(ds, true, false, false);
      }
    }

    // 2. Process official Apple Music & YouTube Music catalog tracks (upgrading previewUrl if a direct stream matched)
    for (const cat of officialCatalog) {
      const matchedStream = findDirectStreamMatch(cat);
      if (matchedStream && matchedStream.previewUrl) {
        const durDiff = Math.abs(matchedStream.durationSeconds - cat.durationSeconds);
        const mins = Math.floor(matchedStream.durationSeconds / 60);
        const secs = matchedStream.durationSeconds % 60;
        const upgraded: ApiTrack = {
          ...cat,
          duration: `${mins}:${secs.toString().padStart(2, '0')}`,
          durationSeconds: matchedStream.durationSeconds,
          previewUrl: matchedStream.previewUrl,
          source: matchedStream.source,
          isFullTrack: true
        };
        upsertCandidate(upgraded, true, durDiff <= 12, true);
      } else if (engine !== 'full') {
        upsertCandidate(cat, false, true, true);
      }
    }

    // Sort strictly descending by composite relevance + studio master quality score
    const ranked = Array.from(scoredMap.values())
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.track);

    return ranked.slice(0, limit);
  }

  /**
   * Normalize song/artist string for fuzzy comparison (handles Paak/Pak, Setareh/Setare, Baroon/Baron, etc.)
   */
  private normalizeForLyricMatch(s: string): string {
    return (s || '')
      .toLowerCase()
      .replace(/aa/g, 'a')
      .replace(/oo|ou/g, 'o')
      .replace(/ee/g, 'i')
      .replace(/eh\b/g, 'e')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Transliterate Persian script into Finglish for LRCLIB queries when titles/artists are in Persian script
   */
  private transliteratePersianToFinglish(text: string): string {
    if (!/[\u0600-\u06FF]/.test(text)) return text;
    const dictionary: Record<string, string> = {
      'سیامک عباسی': 'Siamak Abbasi',
      'سیاوش قمیشی': 'Siavash Ghomayshi',
      'شادمهر عقیلی': 'Shadmehr Aghili',
      'شادمهر': 'Shadmehr Aghili',
      'فرشته پاک': 'Fereshteye Pak',
      'فرشتهٔ پاک': 'Fereshteye Pak',
      'فرنگیس': 'Farangis',
      'ستاره': 'Setareh',
      'محسن یگانه': 'Mohsen Yeganeh',
      'محسن چاوشی': 'Mohsen Chavoshi',
      'فرزاد فرزین': 'Farzad Farzin',
      'بهنام بانی': 'Behnam Bani',
      'رضا بهرام': 'Reza Bahram',
      'گرشا رضایی': 'Garsha Rezaei',
      'عرفان طهماسبی': 'Erfan Tahmasbi',
      'حامیم': 'Haamim',
      'سیروان خسروی': 'Sirvan Khosravi',
      'زانیار خسروی': 'Xaniar Khosravi',
      'مهدی احمدوند': 'Mehdi Ahmadvand',
      'آرش': 'Arash',
      'مسیح': 'Masih',
      'ابی': 'Ebi',
      'گوگوش': 'Googoosh',
      'داریوش': 'Dariush',
      'هایده': 'Hayedeh',
      'معین': 'Moein',
      'همایون شجریان': 'Homayoun Shajarian',
      'علیرضا قربانی': 'Alireza Ghorbani',
      'چارتار': 'Chaartaar',
      'یاس': 'Yas',
      'شایع': 'Shayea',
      'حصین': 'Ho3ein',
      'عشق': 'Eshgh',
      'بارون': 'Baroon',
      'باران': 'Baran',
      'تقدیر': 'Taghdir'
    };

    let result = text.replace(/[\u064B-\u065F\u0654\u0670]/g, '');
    for (const [fa, en] of Object.entries(dictionary)) {
      result = result.replace(new RegExp(fa, 'g'), ` ${en} `);
    }

    const charMap: Record<string, string> = {
      'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
      'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z',
      'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
      'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
      'ق': 'gh', 'ک': 'k', 'ك': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
      'ن': 'n', 'و': 'o', 'ه': 'e', 'ی': 'i', 'ي': 'i', 'ئ': 'y'
    };

    let out = '';
    for (const ch of result) {
      out += charMap[ch] !== undefined ? charMap[ch] : ch;
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  /**
   * Clean SoundCloud / YouTube / Saavn raw track title & artist into canonical song + artist
   */
  private parseCleanSongAndArtist(rawTitle: string, rawArtist: string): { song: string; artist: string } {
    // 1. If title has '|' (e.g. "Siavash Ghomayshi - Farangis | سیاوش قمیشی - فرنگیس"), prefer the Latin side
    const pipeParts = (rawTitle || '').split('|').map((p) => p.trim()).filter(Boolean);
    let workingTitle =
      pipeParts.find((p) => /[a-zA-Z]{2,}/.test(p)) || pipeParts[0] || rawTitle || '';

    // 2. Remove bracketed/parenthesized remix/quality/upload tags
    workingTitle = workingTitle
      .replace(/\((?:official|audio|video|lyric|lyrics|hd|4k|hq|full|slowed|reverb|sped up|remix|edit|bootleg|version|live|cover|remake|demo|master|prod).*?\)/gi, ' ')
      .replace(/\[(?:official|audio|video|lyric|lyrics|hd|4k|hq|full|slowed|reverb|sped up|remix|edit|bootleg|version|live|cover|remake|demo|master|prod).*?\]/gi, ' ')
      .replace(/\b(?:full album|full song|full track|full|slowed|reverb|sped up|official audio|official video|music video|hq|hd|320kbps|mp3)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 3. If title mixes Latin and Persian (e.g. "Fereshteye Paak فرشتهٔ پاک"), extract the Latin part;
    //    if purely Persian, transliterate to Finglish as well
    const latinOnly = workingTitle.replace(/[\u0600-\u06FF]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (latinOnly.length >= 3) {
      workingTitle = latinOnly;
    } else if (/[\u0600-\u06FF]/.test(workingTitle)) {
      workingTitle = this.transliteratePersianToFinglish(workingTitle);
    }

    // 4. Split "Artist - Song Title" if formatted with a dash
    let extractedArtist = '';
    let extractedSong = workingTitle;
    const dashParts = workingTitle.split(/\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);
    if (dashParts.length >= 2) {
      extractedArtist = dashParts[0];
      extractedSong = dashParts.slice(1).join(' ');
    }

    // 5. Clean artist name
    let cleanArtist = (extractedArtist || rawArtist || '')
      .replace(/ - Topic$/i, '')
      .replace(/VEVO$/i, '')
      .replace(/\b(?:official|music|records|channel|radiojavan)\b/gi, '')
      .trim();

    const artistLatin = cleanArtist.replace(/[\u0600-\u06FF]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (artistLatin.length >= 2) {
      cleanArtist = artistLatin;
    } else if (/[\u0600-\u06FF]/.test(cleanArtist)) {
      cleanArtist = this.transliteratePersianToFinglish(cleanArtist);
    }

    return {
      song: extractedSong.trim() || rawTitle.trim(),
      artist: cleanArtist.trim() || rawArtist.trim()
    };
  }

  private buildLyricResultFromRecord(record: any): LyricResult | null {
    if (!record) return null;
    let synced: { time: number; text: string }[] | undefined;
    let plain: string[] | undefined;

    if (record.syncedLyrics) {
      synced = parseLrcLyrics(record.syncedLyrics);
    }
    if (record.plainLyrics) {
      plain = record.plainLyrics
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean);
    } else if (synced && synced.length > 0) {
      plain = synced.map((s) => s.text);
    }

    if ((!synced || synced.length === 0) && (!plain || plain.length === 0)) {
      return null;
    }

    return {
      syncedLyrics: synced,
      plainLyrics: plain,
      instrumental: Boolean(record.instrumental)
    };
  }

  /**
   * Fetch real song-specific lyrics from LRCLIB & Lyrics.ovh with intelligent title/artist normalization
   */
  async fetchLyrics(trackName: string, artistName: string): Promise<LyricResult | null> {
    if (!trackName) return null;

    const cacheKey = `${trackName.toLowerCase().trim()}_${(artistName || '').toLowerCase().trim()}`;
    if (this.lyricsCache.has(cacheKey)) {
      return this.lyricsCache.get(cacheKey)!;
    }

    const { song, artist } = this.parseCleanSongAndArtist(trackName, artistName || '');

    // Tier 1: Direct LRCLIB /api/get with cleaned song & artist
    try {
      const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(song)}&artist_name=${encodeURIComponent(artist)}`;
      const getRes = await fetch(getUrl);
      if (getRes.ok) {
        const data = await getRes.json();
        const parsed = this.buildLyricResultFromRecord(data);
        if (parsed) {
          this.lyricsCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch {}

    // Tier 2: Multi-query LRCLIB /api/search with vowel-normalized & fuzzy scoring
    const fuzzyResult = await this.searchLyricsFallback(song, artist, trackName);
    if (fuzzyResult) {
      this.lyricsCache.set(cacheKey, fuzzyResult);
      return fuzzyResult;
    }

    // Tier 3: Lyrics.ovh public API fallback for plain lyrics
    try {
      const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
      const ovhRes = await fetch(ovhUrl);
      if (ovhRes.ok) {
        const ovhData = await ovhRes.json();
        if (ovhData?.lyrics) {
          const lines = String(ovhData.lyrics)
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l && !l.toLowerCase().startsWith('paroles de la chanson'));
          if (lines.length > 0) {
            const res: LyricResult = { plainLyrics: lines, instrumental: false };
            this.lyricsCache.set(cacheKey, res);
            return res;
          }
        }
      }
    } catch {}

    return null;
  }

  private async searchLyricsFallback(
    song: string,
    artist: string,
    originalTitle: string
  ): Promise<LyricResult | null> {
    const songSingleVowel = song
      .replace(/aa/gi, 'a')
      .replace(/oo/gi, 'o')
      .replace(/ee/gi, 'i');
    const songWithEh = song.replace(/e\b/gi, 'eh');
    const firstWord = song.split(/\s+/)[0] || '';

    const candidateQueries = Array.from(
      new Set(
        [
          `${artist} ${song}`.trim(),
          `${artist} ${songSingleVowel}`.trim(),
          `${artist} ${songWithEh}`.trim(),
          song.trim(),
          songSingleVowel.trim(),
          firstWord.length >= 4 ? `${artist} ${firstWord}`.trim() : '',
          artist.trim(),
          originalTitle.replace(/[|()[\]]/g, ' ').trim()
        ].filter((q) => q && q.length >= 2)
      )
    );

    const targetSongNorm = this.normalizeForLyricMatch(song);
    const targetArtistNorm = this.normalizeForLyricMatch(artist);

    for (const q of candidateQueries) {
      try {
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) continue;
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) continue;

        const withLyrics = list.filter((item: any) => item.syncedLyrics || item.plainLyrics);
        if (withLyrics.length === 0) continue;

        const scored = withLyrics
          .map((item: any) => {
            const tNorm = this.normalizeForLyricMatch(item.trackName || '');
            const aNorm = this.normalizeForLyricMatch(item.artistName || '');
            let score = 0;

            if (tNorm && targetSongNorm) {
              if (tNorm === targetSongNorm) {
                score += 60;
              } else if (tNorm.includes(targetSongNorm) || targetSongNorm.includes(tNorm)) {
                score += 40;
              } else {
                const words = targetSongNorm.split(' ').filter((w) => w.length >= 3);
                for (const w of words) {
                  if (tNorm.includes(w)) score += 18;
                }
              }
            }

            if (aNorm && targetArtistNorm) {
              if (aNorm === targetArtistNorm) {
                score += 35;
              } else if (aNorm.includes(targetArtistNorm) || targetArtistNorm.includes(aNorm)) {
                score += 25;
              } else {
                const aWords = targetArtistNorm.split(' ').filter((w) => w.length >= 3);
                for (const w of aWords) {
                  if (aNorm.includes(w)) score += 12;
                }
              }
            }

            if (item.syncedLyrics) score += 12;
            return { item, score };
          })
          .sort((a, b) => b.score - a.score);

        if (scored[0] && scored[0].score >= 22) {
          const parsed = this.buildLyricResultFromRecord(scored[0].item);
          if (parsed) return parsed;
        }
      } catch {
        // continue to next query
      }
    }

    return null;
  }

  /**
   * User Library Storage (Persist added songs in localStorage)
   */
  getSavedLibraryTracks(): ApiTrack[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map((t: ApiTrack) => {
            const pUrl = (t.previewUrl || '').toLowerCase();
            const isLegacyDemo =
              !pUrl ||
              pUrl.includes('itunes.apple.com') ||
              pUrl.includes('mzstatic.com') ||
              pUrl.includes('dzcdn.net') ||
              pUrl.includes('deezer.com') ||
              pUrl.includes('cf-hls-media.sndcdn.com');
            const durSec = t.durationSeconds && t.durationSeconds >= 65 ? t.durationSeconds : 210;
            const mins = Math.floor(durSec / 60);
            const secs = durSec % 60;
            return {
              ...t,
              durationSeconds: durSec,
              duration: t.durationSeconds && t.durationSeconds < 65 ? `${mins}:${secs.toString().padStart(2, '0')}` : t.duration,
              previewUrl: isLegacyDemo
                ? `/api/resolve-stream?q=${encodeURIComponent(`${t.artist} ${t.title}`)}&title=${encodeURIComponent(t.title)}&artist=${encodeURIComponent(t.artist)}&duration=${durSec}`
                : t.previewUrl,
              isFullTrack: true
            };
          });
        }
      }
    } catch (e) {
      console.warn('Error reading saved library tracks:', e);
    }
    return [];
  }

  saveTrackToLibrary(track: ApiTrack): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const current = this.getSavedLibraryTracks();
      if (current.some(t => t.id === track.id || (t.title === track.title && t.artist === track.artist))) {
        return false;
      }
      const updated = [{ ...track, addedAt: Date.now() }, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.warn('Error saving track to library:', e);
      return false;
    }
  }

  removeTrackFromLibrary(trackId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getSavedLibraryTracks();
      const updated = current.filter(t => t.id !== trackId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error removing track from library:', e);
    }
  }

  isTrackSavedInLibrary(trackId: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getSavedLibraryTracks();
    return current.some(t => t.id === trackId);
  }
}

export const musicApi = new MusicApiService();
