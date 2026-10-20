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

class OpenVideoService {
  async search(query: string, kind: 'all' | 'vod' | 'live' = 'all'): Promise<MediaCatalogItem[]> {
    const params = new URLSearchParams({ q: query, kind });
    const res = await fetch(`/api/video/search?${params}`);
    if (!res.ok) throw new Error(`video search failed: ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(toCatalogItem);
  }

  async resolve(videoSourceId: string): Promise<PlayableStreamManifest | null> {
    const res = await fetch(`/api/video/resolve?id=${encodeURIComponent(videoSourceId)}`);
    if (!res.ok) return null;
    return toManifest(await res.json());
  }

  /** Looks for a free, openly-licensed copy of a catalogue title (e.g. from Cinemeta). */
  async findForTitle(title: string, year?: number): Promise<PlayableStreamManifest | null> {
    const params = new URLSearchParams({ title });
    if (year) params.set('year', String(year));
    const res = await fetch(`/api/video/find?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.stream ? toManifest(data.stream) : null;
  }
}

export const openVideo = new OpenVideoService();
