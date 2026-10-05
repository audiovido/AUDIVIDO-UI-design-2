/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaCatalogItem, SeasonMetadata, EpisodeMetadata } from '../types/streaming';

export const CURATED_FEATURED_CINEMA: MediaCatalogItem[] = [
  {
    id: 'tt7286456',
    imdbId: 'tt7286456',
    title: 'Joker',
    type: 'movie',
    mediaKind: 'full_movie',
    mediaBadge: 'Movie',
    releaseYear: 2019,
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 8.3,
    posterUrl: 'https://images.metahub.space/poster/small/tt7286456/img',
    backdropUrl: 'https://images.metahub.space/background/medium/tt7286456/img',
    overview: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.',
    directors: ['Todd Phillips'],
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
    source: 'Cinema Vault',
    duration: '2h 2m',
    runtimeFormatted: '2h 2m',
    runtimeSeconds: 7320
  },
  {
    id: 'tt0816692',
    imdbId: 'tt0816692',
    title: 'Interstellar',
    type: 'movie',
    mediaKind: 'full_movie',
    mediaBadge: 'Movie',
    releaseYear: 2014,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 8.7,
    posterUrl: 'https://images.metahub.space/poster/small/tt0816692/img',
    backdropUrl: 'https://images.metahub.space/background/medium/tt0816692/img',
    overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft to find a new planet for humans.',
    directors: ['Christopher Nolan'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    source: 'Cinema Vault',
    duration: '2h 49m',
    runtimeFormatted: '2h 49m',
    runtimeSeconds: 10140
  },
  {
    id: 'tt0903747',
    imdbId: 'tt0903747',
    title: 'Breaking Bad',
    type: 'series',
    mediaKind: 'tv_series',
    mediaBadge: 'Series',
    releaseYear: 2008,
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 9.5,
    posterUrl: 'https://images.metahub.space/poster/small/tt0903747/img',
    backdropUrl: 'https://images.metahub.space/background/medium/tt0903747/img',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student.',
    directors: ['Vince Gilligan'],
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    source: 'TV Series',
    duration: '49m',
    runtimeFormatted: '49m',
    runtimeSeconds: 2940
  },
  {
    id: 'tt8229904',
    imdbId: 'tt8229904',
    title: 'Chernobyl',
    type: 'series',
    mediaKind: 'tv_series',
    mediaBadge: 'Series',
    releaseYear: 2019,
    genres: ['Drama', 'History', 'Thriller'],
    rating: 9.3,
    posterUrl: 'https://images.metahub.space/poster/small/tt8229904/img',
    backdropUrl: 'https://images.metahub.space/background/medium/tt8229904/img',
    overview: 'In April 1986, a huge explosion erupted at the Chernobyl nuclear power station in northern Ukraine, following the brave individuals who tried to contain it.',
    directors: ['Craig Mazin'],
    cast: ['Jared Harris', 'Stellan Skarsgård', 'Emily Watson'],
    source: 'TV Series',
    duration: '1h 00m',
    runtimeFormatted: '1h 00m',
    runtimeSeconds: 3600
  },
  {
    id: 'tt1375666',
    imdbId: 'tt1375666',
    title: 'Inception',
    type: 'movie',
    mediaKind: 'full_movie',
    mediaBadge: 'Movie',
    releaseYear: 2010,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 8.8,
    posterUrl: 'https://images.metahub.space/poster/small/tt1375666/img',
    backdropUrl: 'https://images.metahub.space/background/medium/tt1375666/img',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    directors: ['Christopher Nolan'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    source: 'Cinema Vault',
    duration: '2h 28m',
    runtimeFormatted: '2h 28m',
    runtimeSeconds: 8880
  },
  {
    id: 'sintel-4k',
    imdbId: 'tt1727587',
    title: 'Sintel (4K Remastered)',
    type: 'movie',
    mediaKind: 'open_cinema',
    mediaBadge: 'Movie',
    releaseYear: 2024,
    genres: ['Fantasy', 'Action', 'Adventure'],
    rating: 9.2,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    overview: 'A lonely young woman, Sintel, searches for a baby dragon she befriended. Her journey leads her across treacherous lands to a mysterious mountain peak.',
    directors: ['Colin Levy'],
    cast: ['Halina Reijn', 'Thom Hoffman'],
    source: 'Open Cinema',
    duration: '3m 48s',
    runtimeFormatted: '3m 48s',
    runtimeSeconds: 228
  }
];

function formatRuntimeString(raw?: string): { formatted: string; seconds: number } {
  if (!raw) return { formatted: '1h 45m', seconds: 6300 };
  const numMatch = raw.match(/(\d+)/);
  if (!numMatch) return { formatted: raw, seconds: 6300 };

  const minutes = parseInt(numMatch[1], 10);
  if (isNaN(minutes) || minutes <= 0) return { formatted: raw, seconds: 6300 };

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formatted = hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;
  return { formatted, seconds: minutes * 60 };
}

function computeRelevanceScore(item: MediaCatalogItem, query: string): number {
  const q = query.toLowerCase().trim();
  const t = (item.title || '').toLowerCase().trim();
  
  let score = 0;

  if (t === q) score += 100000;
  else if (t.startsWith(q)) score += 60000;
  else if (t.includes(q)) score += 30000;

  const qWords = q.split(/\s+/).filter(w => w.length > 1);
  for (const word of qWords) {
    if (t.includes(word)) score += 10000;
  }

  if (item.type === 'movie') score += 15000;
  else if (item.type === 'series') score += 12000;

  score += Math.round((item.rating || 7) * 100);

  return score;
}

export class SearchAggregatorService {
  private static readonly TVMAZE_BASE = 'https://api.tvmaze.com';
  private static readonly CINEMETA_BASE = 'https://v3-cinemeta.strem.io';
  private cache: Map<string, MediaCatalogItem[]> = new Map();

  public async searchCatalog(query: string, categoryFilter: string = 'all'): Promise<MediaCatalogItem[]> {
    const cleanQuery = query.trim().toLowerCase();
    const cacheKey = `${cleanQuery}_${categoryFilter}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (!cleanQuery) {
      let filtered = [...CURATED_FEATURED_CINEMA];
      if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'watchlist') {
        filtered = filtered.filter(m => 
          m.genres.some(g => g.toLowerCase().includes(categoryFilter)) ||
          m.type.toLowerCase().includes(categoryFilter)
        );
      }
      return filtered;
    }

    const sanitizedQuery = encodeURIComponent(cleanQuery);

    const [cinemetaMovies, cinemetaSeries, tvmazeResults] = await Promise.allSettled([
      this.fetchCinemetaCatalog('movie', sanitizedQuery),
      this.fetchCinemetaCatalog('series', sanitizedQuery),
      this.fetchTVMazeShows(sanitizedQuery)
    ]);

    const aggregatedMap = new Map<string, MediaCatalogItem>();

    // 1. Cinemeta Movies
    if (cinemetaMovies.status === 'fulfilled') {
      cinemetaMovies.value.forEach((item) => aggregatedMap.set(item.id, item));
    }

    // 2. Cinemeta Series
    if (cinemetaSeries.status === 'fulfilled') {
      cinemetaSeries.value.forEach((item) => {
        if (!aggregatedMap.has(item.id)) {
          aggregatedMap.set(item.id, item);
        }
      });
    }

    // 3. TVMaze Shows
    if (tvmazeResults.status === 'fulfilled') {
      for (const tvShow of tvmazeResults.value) {
        if (tvShow.imdbId && aggregatedMap.has(tvShow.imdbId)) {
          const existing = aggregatedMap.get(tvShow.imdbId)!;
          existing.seasons = tvShow.seasons || existing.seasons;
          existing.cast = existing.cast.length ? existing.cast : tvShow.cast;
          existing.directors = existing.directors.length ? existing.directors : tvShow.directors;
          if (!existing.backdropUrl && tvShow.backdropUrl) existing.backdropUrl = tvShow.backdropUrl;
        } else {
          aggregatedMap.set(tvShow.id, tvShow);
        }
      }
    }

    let results = Array.from(aggregatedMap.values());
    results.sort((a, b) => computeRelevanceScore(b, cleanQuery) - computeRelevanceScore(a, cleanQuery));

    if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'watchlist') {
      results = results.filter(m => 
        m.genres.some(g => g.toLowerCase().includes(categoryFilter)) ||
        m.type.toLowerCase().includes(categoryFilter)
      );
    }

    this.cache.set(cacheKey, results);
    return results;
  }

  public async resolveMediaDetails(item: MediaCatalogItem): Promise<MediaCatalogItem> {
    if (item.type === 'movie') {
      return this.fetchDeepCinemetaMovie(item.id, item);
    }
    return this.fetchDeepTVMazeHierarchy(item);
  }

  private async fetchCinemetaCatalog(type: 'movie' | 'series', query: string): Promise<MediaCatalogItem[]> {
    try {
      const resp = await fetch(`${SearchAggregatorService.CINEMETA_BASE}/catalog/${type}/top/search=${query}.json`);
      if (!resp.ok) return [];
      const data = await resp.json();
      if (!data?.metas || !Array.isArray(data.metas)) return [];

      return data.metas.slice(0, 10).map((meta: any) => {
        const imdbId = meta.id || meta.imdb_id;
        const runtimeInfo = formatRuntimeString(meta.runtime);

        return {
          id: imdbId,
          imdbId,
          title: meta.name || 'Untitled Cinema',
          type: type === 'movie' ? 'movie' : 'series',
          mediaKind: type === 'movie' ? 'full_movie' : 'tv_series',
          mediaBadge: type === 'movie' ? 'Movie' : 'Series',
          releaseYear: parseInt(meta.year || meta.releaseInfo, 10) || new Date().getFullYear(),
          genres: meta.genres || (meta.genre ? [meta.genre] : ['Cinema']),
          rating: parseFloat(meta.imdbRating) || 8.5,
          posterUrl: meta.poster || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
          backdropUrl: meta.background || meta.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
          overview: meta.description || '',
          directors: meta.director ? (Array.isArray(meta.director) ? meta.director : [meta.director]) : [],
          cast: meta.cast || [],
          source: 'Cinema Vault',
          duration: runtimeInfo.formatted,
          runtimeFormatted: runtimeInfo.formatted,
          runtimeSeconds: runtimeInfo.seconds
        };
      });
    } catch {
      return [];
    }
  }

  private async fetchTVMazeShows(query: string): Promise<MediaCatalogItem[]> {
    try {
      const resp = await fetch(`${SearchAggregatorService.TVMAZE_BASE}/search/shows?q=${query}`);
      if (!resp.ok) return [];
      const data = await resp.json();
      if (!Array.isArray(data)) return [];

      return data.slice(0, 10).map((entry: any) => {
        const show = entry.show;
        const epRuntime = show.runtime || show.averageRuntime || 45;
        const formatted = `${epRuntime}m`;
        return {
          id: `tvmaze-${show.id}`,
          imdbId: show.externals?.imdb,
          title: show.name || 'Untitled Series',
          type: 'series' as const,
          mediaKind: 'tv_series',
          mediaBadge: 'Series',
          releaseYear: show.premiered ? new Date(show.premiered).getFullYear() : 2024,
          genres: show.genres?.length ? show.genres : ['Drama'],
          rating: show.rating?.average ? Number(show.rating.average) : 8.8,
          posterUrl: show.image?.original || show.image?.medium || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
          backdropUrl: show.image?.original || show.image?.medium || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
          overview: show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : '',
          directors: show.network?.name ? [show.network.name] : ['Global Studio'],
          cast: [],
          source: 'TV Series',
          duration: formatted,
          runtimeFormatted: formatted,
          runtimeSeconds: epRuntime * 60
        };
      });
    } catch {
      return [];
    }
  }

  private async fetchDeepCinemetaMovie(id: string, base: MediaCatalogItem): Promise<MediaCatalogItem> {
    try {
      const cleanId = id.startsWith('tt') ? id : (base.imdbId || id);
      const resp = await fetch(`${SearchAggregatorService.CINEMETA_BASE}/meta/movie/${cleanId}.json`);
      if (!resp.ok) return base;
      const data = await resp.json();
      const meta = data?.meta;
      if (!meta) return base;

      const runtimeInfo = formatRuntimeString(meta.runtime);

      return {
        ...base,
        directors: meta.director ? (Array.isArray(meta.director) ? meta.director : [meta.director]) : base.directors,
        cast: meta.cast || base.cast,
        backdropUrl: meta.background || base.backdropUrl,
        overview: meta.description || base.overview,
        rating: meta.imdbRating ? parseFloat(meta.imdbRating) : base.rating,
        duration: runtimeInfo.formatted,
        runtimeFormatted: runtimeInfo.formatted,
        runtimeSeconds: runtimeInfo.seconds
      };
    } catch {
      return base;
    }
  }

  public async fetchDeepTVMazeHierarchy(base: MediaCatalogItem): Promise<MediaCatalogItem> {
    const rawId = base.id.startsWith('tvmaze-') ? base.id.replace('tvmaze-', '') : null;
    let targetId = rawId;

    if (!targetId && base.imdbId) {
      try {
        const lookup = await fetch(`${SearchAggregatorService.TVMAZE_BASE}/lookup/shows?imdb=${base.imdbId}`);
        if (lookup.ok) {
          const lookupData = await lookup.json();
          targetId = lookupData.id;
        }
      } catch {}
    }

    if (!targetId) {
      try {
        const lookup = await fetch(`${SearchAggregatorService.TVMAZE_BASE}/singlesearch/shows?q=${encodeURIComponent(base.title)}`);
        if (lookup.ok) {
          const lookupData = await lookup.json();
          targetId = lookupData.id;
        }
      } catch {
        return base;
      }
    }

    if (!targetId) return base;

    try {
      const resp = await fetch(`${SearchAggregatorService.TVMAZE_BASE}/shows/${targetId}?embed[]=episodes&embed[]=cast`);
      if (!resp.ok) return base;
      const data = await resp.json();

      const seasonsMap = new Map<number, EpisodeMetadata[]>();
      if (data._embedded?.episodes) {
        data._embedded.episodes.forEach((ep: any, idx: number) => {
          const sNum = ep.season || 1;
          if (!seasonsMap.has(sNum)) seasonsMap.set(sNum, []);

          seasonsMap.get(sNum)!.push({
            id: ep.id || `ep-${idx}`,
            seasonNumber: ep.season || 1,
            episodeNumber: ep.number || (idx + 1),
            title: ep.name || `Episode ${ep.number || idx + 1}`,
            overview: ep.summary ? ep.summary.replace(/<[^>]*>?/gm, '') : `Season ${ep.season || 1} Episode ${ep.number || idx + 1}`,
            thumbnailUrl: ep.image?.original || ep.image?.medium || base.posterUrl,
            runtimeMinutes: ep.runtime || 45,
            airDate: ep.airdate
          });
        });
      }

      const seasons: SeasonMetadata[] = Array.from(seasonsMap.entries()).map(([seasonNumber, episodes]) => ({
        seasonNumber,
        title: `Season ${seasonNumber}`,
        episodes,
      }));

      const cast: string[] = data._embedded?.cast
        ? data._embedded.cast.map((c: any) => c.person?.name).filter(Boolean)
        : base.cast;

      return {
        ...base,
        seasons,
        cast,
        overview: data.summary ? data.summary.replace(/<[^>]*>?/gm, '') : base.overview,
      };
    } catch {
      return base;
    }
  }
}

export const searchAggregator = new SearchAggregatorService();
