/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseYear, stripHtml } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

// US National Archives Catalog API v2. Requires a free key requested from
// Catalog_API@nara.gov (10,000 queries/month); the provider is skipped without one.
const API = 'https://catalog.archives.gov/api/v2/records/search';
const apiKey = () => process.env.NARA_API_KEY;

function records(data: any): any[] {
  return (data?.body?.hits?.hits || []).map((h: any) => h?._source?.record).filter(Boolean);
}

function videoObject(record: any): any | undefined {
  return (record.digitalObjects || []).find((o: any) =>
    /\.mp4$/i.test(o.objectUrl || '') || /video/i.test(o.objectType || ''),
  );
}

function isRestricted(record: any): boolean {
  const status = String(record.useRestriction?.status || '');
  return /restricted/i.test(status) && !/unrestricted/i.test(status);
}

function toResult(record: any): VideoResult | null {
  if (!record.naId || !videoObject(record) || isRestricted(record)) return null;
  return {
    id: `nara:${record.naId}`,
    provider: 'nara',
    kind: 'vod',
    title: record.title,
    description: stripHtml(record.scopeAndContentNote),
    year: parseYear(record.productionDates?.[0]?.year || record.inclusiveDates?.inclusiveStartDate?.year),
    license: 'Public Domain (US Government)',
    attribution: 'US National Archives',
    pageUrl: `https://catalog.archives.gov/id/${record.naId}`,
  };
}

async function query(params: Record<string, string>): Promise<any[]> {
  const search = new URLSearchParams({
    typeOfMaterials: 'Moving Images',
    availableOnline: 'true',
    ...params,
  });
  const data = await fetchJson(`${API}?${search}`, { headers: { 'x-api-key': apiKey()! } });
  return records(data);
}

export const naraProvider: VideoProvider = {
  name: 'nara',
  kind: 'vod',
  enabled: () => Boolean(apiKey()),
  async search(q, limit) {
    const recs = await query({ q, limit: String(limit) });
    return recs.map(toResult).filter(Boolean) as VideoResult[];
  },
  async resolve(naId): Promise<ResolvedStream | null> {
    if (!/^\d+$/.test(naId)) return null;
    const [record] = await query({ naId, limit: '1' });
    const obj = record && !isRestricted(record) ? videoObject(record) : undefined;
    if (!obj) return null;
    return {
      url: obj.objectUrl,
      protocol: 'mp4',
      isLive: false,
      license: 'Public Domain (US Government)',
      attribution: 'US National Archives',
    };
  },
};
