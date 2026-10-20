/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseYear, stripHtml } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

const API = 'https://commons.wikimedia.org/w/api.php';
// Commons only accepts free licences, but NC/ND uploads are still rejected defensively.
const BLOCKED_LICENSE = /\bNC\b|non-?commercial/i;

function videoInfoParams(extra: Record<string, string>): URLSearchParams {
  return new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'videoinfo',
    viprop: 'url|mime|extmetadata|derivatives',
    viurlwidth: '640',
    ...extra,
  });
}

function meta(info: any, key: string): string | undefined {
  return info?.extmetadata?.[key]?.value;
}

function toResult(page: any): VideoResult | null {
  const info = page?.videoinfo?.[0];
  if (!info || !/^video\//.test(info.mime || '')) return null;
  const license = meta(info, 'LicenseShortName');
  if (license && BLOCKED_LICENSE.test(license)) return null;
  const title = String(page.title).replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '');
  return {
    id: `wikimedia:${page.title}`,
    provider: 'wikimedia',
    kind: 'vod',
    title,
    description: stripHtml(meta(info, 'ImageDescription')),
    posterUrl: info.thumburl,
    year: parseYear(meta(info, 'DateTimeOriginal')),
    license,
    attribution: stripHtml(meta(info, 'Artist'), 120),
    pageUrl: info.descriptionurl,
  };
}

export const wikimediaProvider: VideoProvider = {
  name: 'wikimedia',
  kind: 'vod',
  enabled: () => true,
  async search(query, limit) {
    const params = videoInfoParams({
      generator: 'search',
      gsrsearch: `filetype:video ${query}`,
      gsrnamespace: '6',
      gsrlimit: String(limit),
    });
    const data = await fetchJson(`${API}?${params}`);
    const pages = Object.values<any>(data?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    return pages.map(toResult).filter(Boolean) as VideoResult[];
  },
  async featured(limit) {
    return this.search('incategory:"Films in the public domain"', limit);
  },
  async resolve(fileTitle): Promise<ResolvedStream | null> {
    if (!fileTitle.startsWith('File:')) return null;
    const data = await fetchJson(`${API}?${videoInfoParams({ titles: fileTitle })}`);
    const page: any = Object.values(data?.query?.pages || {})[0];
    const info = page?.videoinfo?.[0];
    if (!info) return null;
    const license = meta(info, 'LicenseShortName');
    if (license && BLOCKED_LICENSE.test(license)) return null;

    // Prefer browser-friendly transcodes: 720p/480p VP9 WebM, then MP4, then the original.
    const derivs: any[] = info.derivatives || [];
    const pick =
      derivs.find(d => /720p\.vp9\.webm$/.test(d.src)) ||
      derivs.find(d => /480p\.vp9\.webm$/.test(d.src)) ||
      derivs.find(d => /\.mp4$|\.mov$/.test(d.src)) ||
      derivs.find(d => /\.webm$/.test(d.src));
    const url: string = pick?.src || info.url;

    return {
      url,
      protocol: /\.webm$/i.test(url) ? 'webm' : 'mp4',
      isLive: false,
      license,
      attribution: stripHtml(meta(info, 'Artist'), 120) || 'Wikimedia Commons',
    };
  },
};
