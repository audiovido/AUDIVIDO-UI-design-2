/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayableStreamManifest, MediaCatalogItem, EpisodeMetadata, SubtitleTrackSource, StreamQualityLevel } from '../types/streaming';

const STANDARD_STREAM_QUALITIES: StreamQualityLevel[] = [
  { height: 2160, bitrate: 14000000, label: '4K UHD (2160p)', index: 0 },
  { height: 1080, bitrate: 5500000, label: '1080p Full HD', index: 1 },
  { height: 720, bitrate: 2800000, label: '720p HD', index: 2 },
  { height: 480, bitrate: 1200000, label: '480p SD', index: 3 }
];

export class StreamResolverService {
  private cache: Map<string, PlayableStreamManifest> = new Map();

  public async resolveStreamManifest(media: MediaCatalogItem): Promise<PlayableStreamManifest> {
    const cacheKey = `${media.id}_stream`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const durationSeconds = media.runtimeSeconds || 7200;

    // Direct High-Resolution Master Streams (Play immediately in HTML5 Video with zero black screen)
    const masterStreams: string[] = [
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://media.w3.org/2010/05/sintel/trailer.mp4'
    ];

    const streamUrl = masterStreams[0];

    const manifest: PlayableStreamManifest = {
      sourceUrl: streamUrl,
      protocol: streamUrl.endsWith('.m3u8') ? 'hls' : 'mp4',
      tier: 1,
      resolution: '4K Ultra HD',
      isLive: false,
      qualities: STANDARD_STREAM_QUALITIES,
      subtitles: this.getDefaultSubtitles(),
      mediaKind: media.mediaKind || 'full_movie',
      durationSeconds
    };

    this.cache.set(cacheKey, manifest);
    return manifest;
  }

  public async resolveEpisodeStream(media: MediaCatalogItem, episode: EpisodeMetadata): Promise<PlayableStreamManifest> {
    const epCacheKey = `${media.id}_s${episode.seasonNumber}e${episode.episodeNumber}`;
    if (this.cache.has(epCacheKey)) {
      return this.cache.get(epCacheKey)!;
    }

    const durationSeconds = (episode.runtimeMinutes || 45) * 60;
    const streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    const manifest: PlayableStreamManifest = {
      sourceUrl: streamUrl,
      protocol: 'hls',
      tier: 1,
      resolution: '1080p FHD',
      isLive: false,
      qualities: STANDARD_STREAM_QUALITIES,
      subtitles: this.getDefaultSubtitles(),
      mediaKind: 'tv_series',
      durationSeconds
    };

    this.cache.set(epCacheKey, manifest);
    return manifest;
  }

  private getDefaultSubtitles(): SubtitleTrackSource[] {
    return [
      {
        language: 'Persian',
        label: 'فارسی (FA)',
        srclang: 'fa',
        url: 'https://gist.githubusercontent.com/arashm/2156828/raw/subtitles-fa.vtt',
        isRtl: true
      },
      {
        language: 'English',
        label: 'English (EN)',
        srclang: 'en',
        url: 'https://gist.githubusercontent.com/samdutton/ca37f330e724d13d505c/raw/subtitles-en.vtt',
        isRtl: false
      }
    ];
  }
}

export const streamResolver = new StreamResolverService();
