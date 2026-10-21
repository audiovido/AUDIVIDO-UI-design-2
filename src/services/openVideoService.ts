/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaCatalogItem, PlayableStreamManifest, StreamProtocol } from '../types/streaming';

// Client for the server-side aggregator in server/video (public-domain, Creative Commons
// and official broadcaster streams). Mirrors the shapes in server/video/types.ts.
interface VideoResult {
  id: string;
  provider: string;
  kind: 'vod' | 'live';
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  durationSeconds?: number;
  country?: string;
  categories?: string[];
  license?: string;
  attribution?: string;
  pageUrl?: string;
}

interface ResolvedStream {
  url: string;
  protocol: 'hls' | 'mp4' | 'webm';
  isLive: boolean;
  durationSeconds?: number;
  subtitles?: Array<{ label: string; srclang: string; url: string }>;
  license?: string;
  attribution?: string;
}

export const PROVIDER_LABELS: Record<string, string> = {
  archive: 'Internet Archive',
  prelinger: 'Prelinger Archives',
  blender: 'Blender Open Movies',
  peertube: 'PeerTube',
  nasa: 'NASA',
  nara: 'US National Archives',
  europeana: 'Europeana',
  wikimedia: 'Wikimedia Commons',
  live: 'Live TV',
};

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop';
const RTL_LANGS = new Set(['fa', 'ar', 'he', 'ur', 'ps']);

function formatDuration(seconds?: number): string | undefined {
  if (!seconds) return undefined;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function toCatalogItem(r: VideoResult): MediaCatalogItem {
  const isLive = r.kind === 'live';
  const categories = r.categories?.filter(Boolean) || [];
  const isDocumentary = categories.some(c => /documentar/i.test(c)) || ['nasa', 'nara', 'prelinger'].includes(r.provider);
  const poster = r.posterUrl || FALLBACK_POSTER;
  return {
    id: r.id,
    videoSourceId: r.id,
    provider: r.provider,
    isLive,
    license: r.license,
    attribution: r.attribution,
    pageUrl: r.pageUrl,
    title: r.title,
    type: isLive ? 'live' : isDocumentary ? 'documentary' : 'movie',
    mediaKind: 'open_cinema',
    mediaBadge: PROVIDER_LABELS[r.provider] || r.provider,
    releaseYear: r.year || 0,
    genres: categories.length ? categories.slice(0, 3) : [isLive ? 'Live TV' : PROVIDER_LABELS[r.provider] || 'Open Cinema'],
    rating: 0,
    posterUrl: poster,
    backdropUrl: poster,
    overview: r.description || '',
    directors: r.attribution ? [r.attribution] : [],
    cast: [],
    source: PROVIDER_LABELS[r.provider] || r.provider,
    runtimeSeconds: r.durationSeconds,
    runtimeFormatted: isLive ? 'LIVE' : formatDuration(r.durationSeconds),
  };
}

function toManifest(s: ResolvedStream): PlayableStreamManifest {
  return {
    sourceUrl: s.url,
    protocol: s.protocol as StreamProtocol,
    tier: 1,
    resolution: 'Auto',
    isLive: s.isLive,
    qualities: [],
    subtitles: (s.subtitles || []).map(t => ({
      language: t.label,
      label: t.label,
      srclang: t.srclang,
      url: t.url,
      isRtl: RTL_LANGS.has(t.srclang),
    })),
    mediaKind: 'open_cinema',
    durationSeconds: s.durationSeconds,
  };
}

const CLIENT_BLENDER_FALLBACKS: Array<{ result: VideoResult; streamUrl: string }> = [
  {
    result: {
      id: 'blender:Sintel',
      provider: 'blender',
      kind: 'vod',
      title: 'Sintel',
      year: 2010,
      durationSeconds: 888,
      description: 'A lonely young woman searches for the baby dragon she befriended, a journey that leads her across treacherous lands.',
      posterUrl: 'https://archive.org/services/img/Sintel',
      categories: ['Animation', 'Fantasy'],
      license: 'CC BY 3.0',
      attribution: '(CC) Blender Foundation',
      pageUrl: 'https://archive.org/details/Sintel',
    },
    streamUrl: 'https://archive.org/download/Sintel/sintel-2048-surround_512kb.mp4',
  },
  {
    result: {
      id: 'blender:Tears-of-Steel',
      provider: 'blender',
      kind: 'vod',
      title: 'Tears of Steel',
      year: 2012,
      durationSeconds: 734,
      description: 'In a future Amsterdam, a group of warriors and scientists stage a last stand against rogue robots.',
      posterUrl: 'https://archive.org/services/img/Tears-of-Steel',
      categories: ['Sci-Fi', 'Action'],
      license: 'CC BY 3.0',
      attribution: '(CC) Blender Foundation',
      pageUrl: 'https://archive.org/details/Tears-of-Steel',
    },
    streamUrl: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
  },
  {
    result: {
      id: 'blender:BigBuckBunny_124',
      provider: 'blender',
      kind: 'vod',
      title: 'Big Buck Bunny',
      year: 2008,
      durationSeconds: 596,
      description: 'A giant rabbit takes comic revenge on three bullying rodents.',
      posterUrl: 'https://archive.org/services/img/BigBuckBunny_124',
      categories: ['Animation', 'Comedy'],
      license: 'CC BY 3.0',
      attribution: '(CC) Blender Foundation',
      pageUrl: 'https://archive.org/details/BigBuckBunny_124',
    },
    streamUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
  },
  {
    result: {
      id: 'archive:night-of-the-living-dead_1968',
      provider: 'archive',
      kind: 'vod',
      title: 'Night of the Living Dead',
      year: 1968,
      durationSeconds: 5760,
      description: 'A ragtag group of Pennsylvanians barricade themselves in an old farmhouse to remain safe from a bloodthirsty, flesh-eating breed of monsters.',
      posterUrl: 'https://archive.org/services/img/night-of-the-living-dead_1968',
      categories: ['Horror', 'Classic Cinema'],
      license: 'Public Domain',
      attribution: 'George A. Romero · Internet Archive',
      pageUrl: 'https://archive.org/details/night-of-the-living-dead_1968',
    },
    streamUrl: 'https://archive.org/download/night-of-the-living-dead_1968/night_of_the_living_dead_512kb.mp4',
  },
];

class OpenVideoService {
  async search(query: string, kind: 'all' | 'vod' | 'live' = 'all'): Promise<MediaCatalogItem[]> {
    const params = new URLSearchParams({ q: query, kind });
    try {
      const res = await fetch(`/api/video/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        return (data.results || []).map(toCatalogItem);
      }
    } catch {
      // Fall through to client-side fallback when running on static hosting
    }

    const q = query.trim().toLowerCase();
    const fallbackMatches = CLIENT_BLENDER_FALLBACKS
      .filter(f => !q || f.result.title.toLowerCase().includes(q) || f.result.description?.toLowerCase().includes(q))
      .map(f => toCatalogItem(f.result));
    return fallbackMatches;
  }

  async resolve(videoSourceId: string): Promise<PlayableStreamManifest | null> {
    try {
      const res = await fetch(`/api/video/resolve?id=${encodeURIComponent(videoSourceId)}`);
      if (res.ok) {
        return toManifest(await res.json());
      }
    } catch {
      // Fall through to client-side fallback
    }

    const staticHit = CLIENT_BLENDER_FALLBACKS.find(f => f.result.id === videoSourceId);
    if (staticHit) {
      return toManifest({
        url: staticHit.streamUrl,
        protocol: 'mp4',
        isLive: false,
        durationSeconds: staticHit.result.durationSeconds,
        license: staticHit.result.license,
        attribution: staticHit.result.attribution,
      });
    }
    return null;
  }

  /** Looks for a free, openly-licensed copy of a catalogue title (e.g. from Cinemeta). */
  async findForTitle(title: string, year?: number): Promise<PlayableStreamManifest | null> {
    const params = new URLSearchParams({ title });
    if (year) params.set('year', String(year));
    try {
      const res = await fetch(`/api/video/find?${params}`);
      if (res.ok) {
        const data = await res.json();
        return data?.stream ? toManifest(data.stream) : null;
      }
    } catch {
      // Fall through to client-side fallback
    }

    const clean = title.toLowerCase().trim();
    const staticHit = CLIENT_BLENDER_FALLBACKS.find(f => clean.includes(f.result.title.toLowerCase()));
    if (staticHit) {
      return toManifest({
        url: staticHit.streamUrl,
        protocol: 'mp4',
        isLive: false,
        durationSeconds: staticHit.result.durationSeconds,
        license: staticHit.result.license,
        attribution: staticHit.result.attribution,
      });
    }
    return null;
  }
}

export const openVideo = new OpenVideoService();
