/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fetchJson, parseYear, stripHtml } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

// PeerTube licence ids: 1 CC-BY, 2 CC-BY-SA, 3 CC-BY-ND, 7 CC0/Public Domain.
// Non-commercial licences (4, 5, 6) are excluded.
const ALLOWED_LICENCES = [1, 2, 3, 7];
const SEPIA = 'https://sepiasearch.org/api/v1/search/videos';
const MIN_DURATION_SECONDS = 120;
// Licence labels are set by uploaders and are not checked by PeerTube. Instances found
// re-uploading commercial films/series under fake CC licences are excluded here.
const BLOCKED_HOSTS = new Set(['www.pony.tube', 'pony.tube', 'player.ojamajo.moe', '810video.com']);

function toResult(v: any): VideoResult | null {
  let host: string;
  try {
    host = new URL(v.url).host;
  } catch {
    return null;
  }
  if (BLOCKED_HOSTS.has(host)) return null;
  return {
    id: `peertube:${host}/${v.uuid}`,
    provider: 'peertube',
    kind: 'vod',
    title: v.name,
    description: stripHtml(v.truncatedDescription || v.description),
    posterUrl: v.previewUrl || v.thumbnailUrl,
    year: parseYear(v.originallyPublishedAt || v.publishedAt),
    durationSeconds: v.duration,
    language: v.language?.id || undefined,
    categories: v.category?.label ? [v.category.label] : undefined,
    license: v.licence?.label,
    attribution: [v.account?.displayName || v.account?.name, host].filter(Boolean).join(' · '),
    pageUrl: v.url,
  };
}

async function sepiaSearch(params: URLSearchParams): Promise<VideoResult[]> {
  ALLOWED_LICENCES.forEach(l => params.append('licenceOneOf', String(l)));
  params.set('nsfw', 'false');
  params.set('isLive', 'false');
  params.set('durationMin', String(MIN_DURATION_SECONDS));
  const data = await fetchJson(`${SEPIA}?${params}`);
  return (data?.data || []).map(toResult).filter(Boolean) as VideoResult[];
}

export const peertubeProvider: VideoProvider = {
  name: 'peertube',
  kind: 'vod',
  enabled: () => true,
  search(query, limit) {
    return sepiaSearch(new URLSearchParams({ search: query, count: String(limit) }));
  },
  async resolve(localId): Promise<ResolvedStream | null> {
    const slash = localId.indexOf('/');
    const host = localId.slice(0, slash);
    const uuid = localId.slice(slash + 1);
    if (!/^[a-z0-9.-]+(:\d+)?$/i.test(host) || !/^[a-z0-9-]+$/i.test(uuid) || BLOCKED_HOSTS.has(host)) return null;

    const base = `https://${host}/api/v1/videos/${uuid}`;
    const video = await fetchJson(base);
    if (video.nsfw || !ALLOWED_LICENCES.includes(video.licence?.id)) return null;

    const hls = video.streamingPlaylists?.find((p: any) => p.playlistUrl);
    const mp4 = [...(video.files || [])]
      .filter((f: any) => f.fileUrl)
      .sort((a: any, b: any) => (b.resolution?.id || 0) - (a.resolution?.id || 0))[0];
    if (!hls && !mp4) return null;

    let subtitles: ResolvedStream['subtitles'] = [];
    try {
      const captions = await fetchJson(`${base}/captions`, { timeoutMs: 4000 });
      subtitles = (captions?.data || []).map((c: any) => ({
        label: c.language?.label || c.language?.id,
        srclang: c.language?.id || 'en',
        url: c.fileUrl || `https://${host}${c.captionPath}`,
      }));
    } catch {
      // captions are optional
    }

    return {
      url: hls ? hls.playlistUrl : mp4.fileUrl,
      protocol: hls ? 'hls' : 'mp4',
      isLive: false,
      durationSeconds: video.duration,
      subtitles,
      license: video.licence?.label,
      attribution: [video.account?.displayName, host].filter(Boolean).join(' · '),
    };
  },
};
