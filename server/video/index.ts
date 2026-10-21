/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Express } from 'express';
import { TtlCache } from './http';
import { blenderProvider } from './providers/blender';
import { europeanaProvider } from './providers/europeana';
import { internetArchiveProvider, prelingerProvider } from './providers/internetArchive';
import { liveTvProvider, warmLiveTvIndex } from './providers/liveTv';
import { naraProvider } from './providers/nara';
import { nasaProvider } from './providers/nasa';
import { peertubeProvider } from './providers/peertube';
import { wikimediaProvider } from './providers/wikimedia';
import { ResolvedStream, VideoKind, VideoProvider, VideoResult } from './types';

// Order = rank of a provider's results when relevance is otherwise equal.
const PROVIDERS: VideoProvider[] = [
  blenderProvider,
  internetArchiveProvider,
  peertubeProvider,
  liveTvProvider,
  prelingerProvider,
  nasaProvider,
  naraProvider,
  europeanaProvider,
  wikimediaProvider,
];
const providerByName = new Map(PROVIDERS.map(p => [p.name, p]));

const PER_PROVIDER_LIMIT = 8;
const PROVIDER_TIMEOUT_MS = 9000;

const searchCache = new TtlCache<SearchResponse>(10 * 60 * 1000);
const resolveCache = new TtlCache<ResolvedStream | null>(30 * 60 * 1000);

interface SearchResponse {
  results: VideoResult[];
  providers: Record<string, { count: number; error?: string; ms: number }>;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)),
  ]);
}

function normalizeTitle(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function relevance(r: VideoResult, q: string): number {
  const t = normalizeTitle(r.title);
  if (t === q) return 3;
  if (t.startsWith(q)) return 2;
  if (t.includes(q)) return 1;
  return 0;
}

/** Fans out to every enabled provider; one slow or failing source never blocks the rest. */
async function runProviders(
  kind: VideoKind | 'all',
  call: (p: VideoProvider) => Promise<VideoResult[]> | undefined,
): Promise<SearchResponse> {
  const active = PROVIDERS.filter(p => p.enabled() && (kind === 'all' || p.kind === kind));
  const providers: SearchResponse['providers'] = {};

  const settled = await Promise.all(active.map(async p => {
    const started = Date.now();
    try {
      const pending = call(p);
      const results = pending ? await withTimeout(pending, PROVIDER_TIMEOUT_MS) : [];
      providers[p.name] = { count: results.length, ms: Date.now() - started };
      return results;
    } catch (e: any) {
      providers[p.name] = { count: 0, error: String(e?.message || e), ms: Date.now() - started };
      return [];
    }
  }));

  return { results: settled.flat(), providers };
}

export async function searchVideos(query: string, kind: VideoKind | 'all' = 'all'): Promise<SearchResponse> {
  const q = query.trim();
  const key = `${kind}|${q.toLowerCase()}`;
  const cached = searchCache.get(key);
  if (cached) return cached;

  const response = q
    ? await runProviders(kind, p => p.search(q, PER_PROVIDER_LIMIT))
    : await runProviders(kind, p => p.featured?.(6));

  if (q) {
    // Stable sort: higher title relevance first, provider order breaks ties.
    const nq = normalizeTitle(q);
    response.results = response.results
      .map((r, i) => ({ r, i, s: relevance(r, nq) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map(x => x.r);
  }

  searchCache.set(key, response);
  return response;
}

export async function resolveVideo(id: string): Promise<ResolvedStream | null> {
  const cached = resolveCache.get(id);
  if (cached !== undefined) return cached;

  const sep = id.indexOf(':');
  const provider = providerByName.get(id.slice(0, sep));
  if (sep < 1 || !provider || !provider.enabled()) return null;

  const stream = await withTimeout(provider.resolve(id.slice(sep + 1)), PROVIDER_TIMEOUT_MS * 2);
  resolveCache.set(id, stream);
  return stream;
}

function cleanFilmTitle(s: string): string {
  return normalizeTitle(
    s
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\b(18|19|20)\d\d\b/g, ' ')
      .replace(/\b(4k|remastered|hd|1080p|720p|full\s*movie|restored)\b/gi, ' '),
  );
}

/**
 * Finds a free, openly-licensed copy of a specific title (e.g. a Cinemeta/IMDb result).
 * Deliberately strict — an exact normalised title match and, when known, a year within ±2 —
 * so a different film with a similar name is never played in its place.
 */
export async function findTitle(title: string, year?: number): Promise<{ result: VideoResult; stream: ResolvedStream } | null> {
  const nq = cleanFilmTitle(title);
  if (!nq) return null;
  const { results } = await searchVideos(nq, 'vod');
  const candidates = results.filter(r => {
    const rt = cleanFilmTitle(r.title);
    const titleMatches = rt === nq || rt.startsWith(nq + ' ');
    const yearMatches = !year || !r.year || Math.abs(r.year - year) <= 2;
    return titleMatches && yearMatches;
  });
  for (const result of candidates.slice(0, 4)) {
    try {
      const stream = await resolveVideo(result.id);
      if (stream) return { result, stream };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

export function registerVideoRoutes(app: Express) {
  warmLiveTvIndex();

  app.get('/api/video/search', async (req, res) => {
    const q = String(req.query.q || '');
    const kind = (['vod', 'live'].includes(String(req.query.kind)) ? req.query.kind : 'all') as VideoKind | 'all';
    try {
      res.json(await searchVideos(q, kind));
    } catch (e: any) {
      res.status(500).json({ error: String(e?.message || e), results: [] });
    }
  });

  app.get('/api/video/resolve', async (req, res) => {
    const id = String(req.query.id || '');
    try {
      const stream = await resolveVideo(id);
      if (!stream) return res.status(404).json({ error: 'No playable, openly-licensed stream for this id' });
      res.json(stream);
    } catch (e: any) {
      res.status(502).json({ error: String(e?.message || e) });
    }
  });

  app.get('/api/video/find', async (req, res) => {
    const title = String(req.query.title || '').trim();
    const year = Number(req.query.year) || undefined;
    if (!title) return res.status(400).json({ error: 'title is required' });
    try {
      const found = await findTitle(title, year);
      if (!found) return res.status(404).json({ error: 'No free, openly-licensed copy of this title was found' });
      res.json(found);
    } catch (e: any) {
      res.status(502).json({ error: String(e?.message || e) });
    }
  });

  app.get('/api/video/providers', (_req, res) => {
    res.json(PROVIDERS.map(p => ({ name: p.name, kind: p.kind, enabled: p.enabled() })));
  });
}
