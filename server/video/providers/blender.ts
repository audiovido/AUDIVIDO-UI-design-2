/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoProvider, VideoResult } from '../types';
import { resolveArchiveItem } from './internetArchive';

// download.blender.org only serves zips/mkv, so the CC-BY films are played from
// their Internet Archive mirrors (identifiers verified to carry a CC-BY licenseurl).
const BLENDER_FILMS: Array<Omit<VideoResult, 'provider' | 'kind'> & { keywords: string }> = [
  {
    id: 'blender:Sintel',
    title: 'Sintel',
    year: 2010,
    description: 'A lonely young woman searches for the baby dragon she befriended, a journey that leads her across treacherous lands.',
    keywords: 'sintel dragon fantasy animation blender',
  },
  {
    id: 'blender:Tears-of-Steel',
    title: 'Tears of Steel',
    year: 2012,
    description: 'In a future Amsterdam, a group of warriors and scientists stage a last stand against rogue robots.',
    keywords: 'tears of steel sci-fi robots amsterdam blender',
  },
  {
    id: 'blender:BigBuckBunny_124',
    title: 'Big Buck Bunny',
    year: 2008,
    description: 'A giant rabbit takes comic revenge on three bullying rodents.',
    keywords: 'big buck bunny rabbit comedy animation blender',
  },
  {
    id: 'blender:ElephantsDream',
    title: 'Elephants Dream',
    year: 2006,
    description: 'Two characters explore a vast, surreal machine — the first open movie by the Blender Foundation.',
    keywords: 'elephants dream surreal animation blender',
  },
];

function toResult(film: (typeof BLENDER_FILMS)[number]): VideoResult {
  const { keywords: _keywords, ...rest } = film;
  const identifier = film.id.slice('blender:'.length);
  return {
    ...rest,
    provider: 'blender',
    kind: 'vod',
    categories: ['Animation', 'Short Film'],
    license: 'CC BY 3.0',
    attribution: '(CC) Blender Foundation',
    posterUrl: `https://archive.org/services/img/${identifier}`,
    pageUrl: `https://archive.org/details/${identifier}`,
  };
}

export const blenderProvider: VideoProvider = {
  name: 'blender',
  kind: 'vod',
  enabled: () => true,
  async search(query, limit) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return BLENDER_FILMS
      .filter(f => words.some(w => f.keywords.includes(w)))
      .slice(0, limit)
      .map(toResult);
  },
  async featured(limit) {
    return BLENDER_FILMS.slice(0, limit).map(toResult);
  },
  async resolve(identifier) {
    const stream = await resolveArchiveItem(identifier);
    return stream && { ...stream, attribution: '(CC) Blender Foundation' };
  },
};
