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

  /**
   * Search YouTube Music Official Studio Master Catalog
   */
  async searchYouTubeMusic(query: string, limit: number = 20): Promise<ApiTrack[]> {
    const trimmed = query.trim();
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

        return {
          id: item.id || `ytm-${Math.random()}`,
          title: item.title || 'Official Song',
          artist: item.artist || 'Official Artist',
          album: item.album || 'Master Release',
          duration: `${mins}:${secs.toString().padStart(2, '0')}`,
          durationSeconds: durSec,
          coverUrl: item.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          previewUrl: `/api/resolve-stream?q=${encodeURIComponent(item.title + ' ' + item.artist)}`,
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
    const trimmed = query.trim();
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
      const results: ApiTrack[] = (data.results || []).map((item: any) => {
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

        return {
          id: `itunes-${item.trackId}`,
          title: item.trackName || 'Unknown Title',
          artist: item.artistName || 'Unknown Artist',
          album: item.collectionName || item.trackName || 'Single',
          duration: durationFormatted,
          durationSeconds: durationSec,
          coverUrl: highResArtwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          previewUrl: `/api/resolve-stream?q=${encodeURIComponent((item.trackName || '') + ' ' + (item.artistName || ''))}`,
          genre: item.primaryGenreName || 'Pop / Rock',
          year: releaseYear,
          source: 'iTunes' as const,
          plays: `${(Math.random() * 5 + 1).toFixed(1)}M`,
          isFullTrack: true
        };
      });

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
    const trimmed = query.trim();
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

      const results: ApiTrack[] = collection.map((item: any) => {
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
      }).filter((t: ApiTrack) => Boolean(t.previewUrl));

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
   * Search JioSaavn 320kbps Full Studio & Audius Open Full Stream Catalog
   */
  async searchFullStreamCatalog(query: string, limit: number = 15): Promise<ApiTrack[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const cacheKey = `fullcat_${trimmed.toLowerCase()}_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const endpoint = `/api/full-stream-catalog?q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(endpoint);
      if (!res.ok) return [];

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
      }
      return results.slice(0, limit);
    } catch (e) {
      console.warn('Full stream catalog search failed:', e);
      return [];
    }
  }

  /**
   * Resolve Full-Length Audio Stream Waterfall (SoundCloud -> JioSaavn 320k -> Audius -> YouTube Music)
   */
  async resolveFullTrackAudio(title: string, artist: string): Promise<{ streamUrl?: string; durationSeconds?: number } | null> {
    const key = `${title.toLowerCase().trim()}___${artist.toLowerCase().trim()}`;
    if (this.streamCache.has(key)) {
      return this.streamCache.get(key)!;
    }

    try {
      const q = `${title} ${artist}`.trim();
      const endpoint = `/api/resolve-stream?q=${encodeURIComponent(q)}`;
      const res = await fetch(endpoint);

      if (res.ok) {
        const data = await res.json();
        if (data?.streamUrl) {
          const result = {
            streamUrl: data.streamUrl,
            durationSeconds: data.durationSeconds || 210
          };
          this.streamCache.set(key, result);
          return result;
        }
      }
    } catch (e) {
      console.warn('Error resolving full track:', e);
    }
    return null;
  }

  /**
   * Search across all engines with Full-Length Stream Priority (SoundCloud + JioSaavn 320k + Audius + YouTube Music)
   */
  async searchTracks(
    query: string, 
    engine: 'all' | 'full' | 'itunes' | 'deezer' = 'all', 
    limit: number = 25
  ): Promise<ApiTrack[]> {
    const q = query.trim();
    if (!q) return [];

    if (engine === 'full') {
      const [sc, fullCat, ytm] = await Promise.allSettled([
        this.searchSoundCloud(q, limit),
        this.searchFullStreamCatalog(q, limit),
        this.searchYouTubeMusic(q, limit)
      ]);
      return [
        ...(sc.status === 'fulfilled' ? sc.value : []),
        ...(fullCat.status === 'fulfilled' ? fullCat.value : []),
        ...(ytm.status === 'fulfilled' ? ytm.value : [])
      ].slice(0, limit);
    }
    if (engine === 'itunes') {
      return this.searchITunes(q, limit);
    }

    // Default 'all' (shared by Music 2 and Music 3):
    // Priority 1: SoundCloud Direct Full Unencrypted Streams
    // Priority 2: JioSaavn 320kbps & Audius Direct Full Streams
    // Priority 3: YouTube Music & Apple iTunes Catalog (resolved via full-track /api/resolve-stream)
    const [scRes, fullCatRes, ytmRes, itunesRes] = await Promise.allSettled([
      this.searchSoundCloud(q, 15),
      this.searchFullStreamCatalog(q, 12),
      this.searchYouTubeMusic(q, 12),
      this.searchITunes(q, 15)
    ]);

    const scTracks = scRes.status === 'fulfilled' ? scRes.value : [];
    const fullCatTracks = fullCatRes.status === 'fulfilled' ? fullCatRes.value : [];
    const ytmTracks = ytmRes.status === 'fulfilled' ? ytmRes.value : [];
    const itunesTracks = itunesRes.status === 'fulfilled' ? itunesRes.value : [];

    // Helper to enrich direct full-stream tracks with HD artwork/album from iTunes if available
    const enrichWithMetadata = (track: ApiTrack): ApiTrack => {
      const normTitle = track.title.toLowerCase();
      const match = itunesTracks.find((it) => {
        const itTitle = it.title.toLowerCase();
        return itTitle && (normTitle.includes(itTitle) || itTitle.includes(normTitle));
      });
      if (match) {
        return {
          ...track,
          coverUrl:
            !track.coverUrl || track.coverUrl.includes('unsplash.com') || track.coverUrl.includes('default_avatar')
              ? match.coverUrl
              : track.coverUrl,
          album: track.album === 'SoundCloud Master' || track.album === 'Studio Master' ? match.album : track.album,
          genre: track.genre === 'SoundCloud Global' ? match.genre : track.genre,
          year: track.year || match.year
        };
      }
      return track;
    };

    const merged: ApiTrack[] = [];
    const seen = new Set<string>();

    const addTrack = (t: ApiTrack) => {
      // Preserve Unicode letters & numbers (Persian, English, etc.)
      const normalizedTitle = t.title.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim() || t.title.trim();
      const normalizedArtist = t.artist.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim() || t.artist.trim();
      const key = `${normalizedTitle}_${normalizedArtist}_${t.id}`;
      const titleArtistKey = `${normalizedTitle}_${normalizedArtist}`;
      if (!seen.has(key) && !seen.has(titleArtistKey) && merged.length < limit) {
        seen.add(key);
        if (normalizedTitle.length > 2) {
          seen.add(titleArtistKey);
        }
        merged.push(enrichWithMetadata(t));
      }
    };

    // 1. Add SoundCloud full unencrypted tracks first
    for (const sc of scTracks) {
      addTrack(sc);
    }

    // 2. Add JioSaavn 320kbps & Audius full tracks
    for (const fc of fullCatTracks) {
      addTrack(fc);
    }

    // 3. Add YouTube Music Official Tracks
    for (const yt of ytmTracks) {
      addTrack(yt);
    }

    // 4. Add iTunes metadata tracks (which resolve via full-stream /api/resolve-stream)
    for (const it of itunesTracks) {
      addTrack(it);
    }

    return merged.slice(0, limit);
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
        return JSON.parse(data);
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
