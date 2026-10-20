/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseYear, stripHtml, toHttps } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

const API = 'https://images-api.nasa.gov';
// Rendition suffixes in collection.json, best first. ~orig can be several GB.
const RENDITIONS = ['~medium.mp4', '~mobile.mp4', '~small.mp4', '~orig.mp4'];

function toResult(item: any): VideoResult | null {
  const data = item?.data?.[0];
  if (!data?.nasa_id) return null;
  const thumb = (item.links || []).find((l: any) => l.render === 'image')?.href;
  return {
    id: `nasa:${data.nasa_id}`,
    provider: 'nasa',
    kind: 'vod',
    title: data.title,
    description: stripHtml(data.description),
    posterUrl: thumb ? toHttps(thumb) : undefined,
    year: parseYear(data.date_created),
    categories: (data.keywords || []).slice(0, 4),
    license: 'Public Domain (NASA)',
    attribution: `NASA ${data.center || ''}`.trim(),
    pageUrl: `https://images.nasa.gov/details/${encodeURIComponent(data.nasa_id)}`,
  };
}

async function searchNasa(params: URLSearchParams, limit: number): Promise<VideoResult[]> {
  params.set('media_type', 'video');
  params.set('page_size', String(limit));
  const data = await fetchJson(`${API}/search?${params}`);
  return (data?.collection?.items || []).map(toResult).filter(Boolean) as VideoResult[];
}

export const nasaProvider: VideoProvider = {
  name: 'nasa',
  kind: 'vod',
  enabled: () => true,
  search(query, limit) {
    return searchNasa(new URLSearchParams({ q: query }), limit);
  },
  featured(limit) {
    return searchNasa(new URLSearchParams({ q: 'documentary', keywords: 'documentary' }), limit);
  },
  async resolve(nasaId): Promise<ResolvedStream | null> {
    const files: string[] = await fetchJson(
      `https://images-assets.nasa.gov/video/${encodeURIComponent(nasaId)}/collection.json`,
    );
    const urls = files.map(f => toHttps(f).replace(/ /g, '%20'));
    const video = RENDITIONS.map(r => urls.find(u => u.endsWith(r))).find(Boolean)
      || urls.find(u => /\.mp4$/i.test(u));
    if (!video) return null;

    const subtitles = urls
      .filter(u => /\.vtt$/i.test(u))
      .map(u => ({ label: 'English', srclang: 'en', url: u }));

    return {
      url: video,
      protocol: 'mp4',
      isLive: false,
      subtitles,
      license: 'Public Domain (NASA)',
      attribution: 'NASA',
    };
  },
};
