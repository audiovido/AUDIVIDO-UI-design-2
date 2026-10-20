/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseYear, stripHtml } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

const API = 'https://api.europeana.eu/record/v2';
// 'api2demo' is Europeana's shared demo key: fine for development, rate-limited.
// Set EUROPEANA_API_KEY (free, https://pro.europeana.eu/page/get-api) for production.
const apiKey = () => process.env.EUROPEANA_API_KEY || 'api2demo';
const OPEN_RIGHTS = /publicdomain|\/zero\/|\/licenses\/by\/|\/licenses\/by-sa\//i;

function first(v: any): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function rightsLabel(url?: string): string | undefined {
  if (!url) return undefined;
  if (/publicdomain\/mark/i.test(url)) return 'Public Domain Mark';
  if (/\/zero\//i.test(url)) return 'CC0';
  const m = url.match(/licenses\/([a-z-]+)\//i);
  return m ? `CC ${m[1].toUpperCase()}` : url;
}

function cleanTitle(raw?: string): string | undefined {
  const t = raw?.replace(/^[\s,-]*video[\s,-]*/i, '').trim();
  return t && !/^(video|film|[\s,-])+$/i.test(t) ? t : undefined;
}

function providerName(value?: string): string {
  return value && !/^https?:\/\//.test(value) ? value : 'Europeana';
}

function toResult(item: any): VideoResult | null {
  if (!item?.id || !first(item.edmIsShownBy)) return null;
  const title = cleanTitle(first(item.title)) || cleanTitle(first(item.dcDescription));
  if (!title) return null;
  const rights = first(item.rights);
  if (!rights || !OPEN_RIGHTS.test(rights)) return null;
  return {
    id: `europeana:${item.id}`,
    provider: 'europeana',
    kind: 'vod',
    title,
    description: stripHtml(first(item.dcDescription)),
    posterUrl: first(item.edmPreview),
    year: parseYear(first(item.year)),
    language: first(item.language),
    country: first(item.country),
    license: rightsLabel(rights),
    attribution: providerName(first(item.dataProvider)),
    pageUrl: item.guid,
  };
}

async function searchEuropeana(query: string, limit: number): Promise<VideoResult[]> {
  const params = new URLSearchParams({
    wskey: apiKey(),
    query,
    rows: String(limit),
    reusability: 'open',
    media: 'true',
  });
  params.append('qf', 'TYPE:VIDEO');
  params.append('qf', 'MIME_TYPE:video/mp4');
  const data = await fetchJson(`${API}/search.json?${params}`);
  return (data?.items || []).map(toResult).filter(Boolean) as VideoResult[];
}

export const europeanaProvider: VideoProvider = {
  name: 'europeana',
  kind: 'vod',
  enabled: () => true,
  search: searchEuropeana,
  async resolve(recordId): Promise<ResolvedStream | null> {
    if (!/^\/[\w-]+\/[\w.-]+$/.test(recordId)) return null;
    const data = await fetchJson(`${API}${recordId}.json?wskey=${encodeURIComponent(apiKey())}`);
    const agg = data?.object?.aggregations?.[0];
    const url: string | undefined = agg?.edmIsShownBy;
    const rights = first(agg?.edmRights?.def);
    if (!url || !rights || !OPEN_RIGHTS.test(rights)) return null;
    return {
      url,
      protocol: 'mp4',
      isLive: false,
      license: rightsLabel(rights),
      attribution: providerName(first(agg?.edmDataProvider?.def)),
    };
  },
};
