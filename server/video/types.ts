/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VideoProtocol = 'hls' | 'mp4' | 'webm';
export type VideoKind = 'vod' | 'live';

export interface VideoSubtitle {
  label: string;
  srclang: string;
  url: string;
}

/** A search hit. `id` is `<provider>:<provider-specific id>` and is passed back to /api/video/resolve. */
export interface VideoResult {
  id: string;
  provider: string;
  kind: VideoKind;
  title: string;
  description?: string;
  posterUrl?: string;
  year?: number;
  durationSeconds?: number;
  language?: string;
  country?: string;
  categories?: string[];
  license?: string;
  attribution?: string;
  pageUrl?: string;
}

export interface ResolvedStream {
  url: string;
  protocol: VideoProtocol;
  isLive: boolean;
  durationSeconds?: number;
  subtitles?: VideoSubtitle[];
  license?: string;
  attribution?: string;
}

export interface VideoProvider {
  name: string;
  kind: VideoKind;
  /** Providers that need a key return false when it is missing, and are skipped. */
  enabled(): boolean;
  search(query: string, limit: number): Promise<VideoResult[]>;
  resolve(localId: string): Promise<ResolvedStream | null>;
  /** Optional curated picks for the empty-query landing view. */
  featured?(limit: number): Promise<VideoResult[]>;
}
