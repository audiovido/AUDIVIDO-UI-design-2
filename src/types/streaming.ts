/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MediaType = 'movie' | 'series' | 'anime' | 'documentary';
export type MediaKind = 'full_movie' | 'tv_series' | 'youtube_trailer' | 'open_cinema';

export interface EpisodeMetadata {
  id: string | number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  thumbnailUrl: string;
  runtimeMinutes: number;
  airDate?: string;
  videoUrl?: string;
}

export interface SeasonMetadata {
  seasonNumber: number;
  title: string;
  episodes: EpisodeMetadata[];
}

export interface MediaCatalogItem {
  id: string;
  imdbId?: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  mediaKind?: MediaKind;
  mediaBadge?: string;
  releaseYear: number;
  genres: string[];
  rating: number;
  posterUrl: string;
  backdropUrl: string;
  overview: string;
  directors: string[];
  cast: string[];
  seasons?: SeasonMetadata[];
  source?: string;
  duration?: string;
  runtimeFormatted?: string;
  runtimeSeconds?: number;
  trailerKey?: string;
}

export type StreamProtocol = 'hls' | 'mp4' | 'webm' | 'embed';

export interface StreamQualityLevel {
  height: number;
  bitrate: number;
  label: string;
  index: number;
}

export interface SubtitleTrackSource {
  language: string;
  label: string;
  srclang: string;
  url: string;
  isRtl?: boolean;
}

export interface PlayableStreamManifest {
  sourceUrl: string;
  protocol: StreamProtocol;
  tier: 1 | 2 | 3;
  resolution: string;
  isLive: boolean;
  qualities: StreamQualityLevel[];
  subtitles: SubtitleTrackSource[];
  mediaKind?: MediaKind;
  durationSeconds?: number;
  availableModes?: {
    fullMovieUrl?: string;
    trailerUrl?: string;
    hasFullMovie: boolean;
    hasTrailer: boolean;
  };
}

export interface ParsedSubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}
