/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayableStreamManifest, MediaCatalogItem, EpisodeMetadata } from '../types/streaming';
import { openVideo } from './openVideoService';

export class StreamResolverService {
  private cache: Map<string, PlayableStreamManifest | null> = new Map();

  /**
   * Returns a playable stream for the item, or null when no legal source exists.
   * - Items from the open video search carry a `videoSourceId` and resolve directly.
   * - Catalogue-only titles (Cinemeta / TVMaze) are matched against the open sources by exact
   *   title + year; mainstream titles generally have no free legal copy and return null.
   */
  public async resolveStreamManifest(media: MediaCatalogItem): Promise<PlayableStreamManifest | null> {
    const cacheKey = `${media.id}_stream`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let manifest: PlayableStreamManifest | null = null;
    try {
      manifest = media.videoSourceId
        ? await openVideo.resolve(media.videoSourceId)
        : await openVideo.findForTitle(media.title, media.releaseYear || undefined);
    } catch (e) {
      console.warn('Stream resolve failed:', e);
    }

    // Live streams are not cached: their URLs can rotate.
    if (!manifest?.isLive) this.cache.set(cacheKey, manifest);
    return manifest;
  }

  /** No open source carries individual series episodes; kept for the episode UI. */
  public async resolveEpisodeStream(_media: MediaCatalogItem, _episode: EpisodeMetadata): Promise<PlayableStreamManifest | null> {
    return null;
  }
}

export const streamResolver = new StreamResolverService();
