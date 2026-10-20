/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseDuration, parseYear, stripHtml, TtlCache } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

// Uploaders set licenseurl themselves and collections contain mislabelled uploads,
// so only items whose licence explicitly allows redistribution are surfaced.
const OPEN_LICENSE = /publicdomain|\/zero\/|\/licenses\/by\/|\/licenses\/by-sa\/|\/licenses\/by-nd\//i;

// Landing-page picks: well-known public-domain classics (licence verified at resolve time).
const FEATURED_IDS = ['night-of-the-living-dead_1968', 'his_girl_friday', 'charlie_chaplin_film_fest', 'house_on_haunted_hill_ipod'];

// Best first. IA format names vary ("h.264", "h.264 IA", "h.264 MPEG4", ...). Ogg/Theora
// (.ogv) is never used: current Chrome no longer decodes Theora.
const FORMAT_RANK = [/^h\.264/i, /512Kb MPEG4/i, /MPEG4/i];

function formatRank(format: string): number {
  const i = FORMAT_RANK.findIndex(re => re.test(format || ''));
  return i === -1 ? FORMAT_RANK.length : i;
}

const metaCache = new TtlCache<any>(60 * 60 * 1000);

function luceneEscape(q: string): string {
  return q.replace(/([+\-!(){}\[\]^"~*?:\\\/]|&&|\|\|)/g, '\\$1');
}

export function licenseLabel(url?: string): string | undefined {
  if (!url) return undefined;
  if (/publicdomain|\/zero\//i.test(url)) return 'Public Domain';
  const m = url.match(/licenses\/([a-z-]+)\/?([\d.]+)?/i);
  return m ? `CC ${m[1].toUpperCase()}${m[2] ? ' ' + m[2] : ''}` : url;
}

async function getMetadata(identifier: string): Promise<any> {
  const cached = metaCache.get(identifier);
  if (cached) return cached;
  const meta = await fetchJson(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
  metaCache.set(identifier, meta);
  return meta;
}

function first<T>(v: T | T[] | undefined): T | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function docToResult(doc: any, provider: string): VideoResult {
  return {
    id: `${provider}:${doc.identifier}`,
    provider,
    kind: 'vod',
    title: first(doc.title) || doc.identifier,
    description: stripHtml(first(doc.description)),
    posterUrl: `https://archive.org/services/img/${doc.identifier}`,
    year: parseYear(doc.year || doc.date),
    durationSeconds: parseDuration(first(doc.runtime)),
    categories: [].concat(doc.subject || []).slice(0, 4).map(String),
    license: licenseLabel(doc.licenseurl),
    pageUrl: `https://archive.org/details/${doc.identifier}`,
  };
}

export async function resolveArchiveItem(identifier: string): Promise<ResolvedStream | null> {
  const meta = await getMetadata(identifier);
  const licenseurl: string | undefined = meta?.metadata?.licenseurl;
  if (!licenseurl || !OPEN_LICENSE.test(licenseurl)) return null;

  const files: any[] = meta.files || [];
  const playable = files.filter(f => /\.mp4$/i.test(f.name));
  if (!playable.length) return null;

  // Best format first; among equals, the smaller file starts faster.
  playable.sort((a, b) => formatRank(a.format) - formatRank(b.format) || Number(a.size || 0) - Number(b.size || 0));
  const file = playable[0];
  const encodedPath = String(file.name).split('/').map(encodeURIComponent).join('/');

  const subtitles = files
    .filter(f => /\.vtt$/i.test(f.name))
    .map(f => ({
      label: f.name.replace(/\.vtt$/i, ''),
      srclang: (f.name.match(/[._-](\w{2})\.vtt$/i)?.[1] || 'en').toLowerCase(),
      url: `https://archive.org/download/${identifier}/${String(f.name).split('/').map(encodeURIComponent).join('/')}`,
    }));

  return {
    url: `https://archive.org/download/${identifier}/${encodedPath}`,
    protocol: 'mp4',
    isLive: false,
    durationSeconds: parseDuration(file.length) || parseDuration(first(meta.metadata.runtime)),
    subtitles,
    license: licenseLabel(licenseurl),
    attribution: [first(meta.metadata.creator), 'Internet Archive'].filter(Boolean).join(' · '),
  };
}

function makeArchiveProvider(name: string, collections: string[], featuredIds?: string[]): VideoProvider {
  const collectionClause = collections.map(c => `collection:${c}`).join(' OR ');
  const baseQuery = `mediatype:movies AND (${collectionClause}) AND licenseurl:*`;
  const fields = ['identifier', 'title', 'description', 'year', 'date', 'runtime', 'licenseurl', 'subject'];

  const runSearch = async (q: string, limit: number, sort?: string) => {
    const params = new URLSearchParams({ q, rows: String(limit * 2), output: 'json' });
    fields.forEach(f => params.append('fl[]', f));
    if (sort) params.append('sort[]', sort);
    const data = await fetchJson(`https://archive.org/advancedsearch.php?${params}`);
    return (data?.response?.docs || [])
      .filter((d: any) => OPEN_LICENSE.test(String(d.licenseurl || '')))
      .slice(0, limit)
      .map((d: any) => docToResult(d, name));
  };

  return {
    name,
    kind: 'vod',
    enabled: () => true,
    search(query, limit) {
      const terms = luceneEscape(query.trim());
      return runSearch(`(title:(${terms}) OR subject:(${terms})) AND ${baseQuery}`, limit);
    },
    featured(limit) {
      const q = featuredIds ? `identifier:(${featuredIds.join(' OR ')}) AND licenseurl:*` : baseQuery;
      return runSearch(q, limit, 'downloads desc');
    },
    resolve: resolveArchiveItem,
  };
}

export const internetArchiveProvider = makeArchiveProvider('archive', ['feature_films'], FEATURED_IDS);
export const prelingerProvider = makeArchiveProvider('prelinger', ['prelinger']);
