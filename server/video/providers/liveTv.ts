/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs/promises';
import path from 'path';
import { fetchJson } from '../http';
import { ResolvedStream, VideoProvider, VideoResult } from '../types';

// iptv-org lists user-submitted links with no legal guarantee, so only streams served
// from the broadcaster's own infrastructure are surfaced:
//   1. the stream host shares a registrable domain with the channel's official website, or
//   2. the stream matches an explicit entry below (broadcasters that publish on a shared CDN).
const OFFICIAL_CDN_STREAMS: Array<{ host: RegExp; path?: RegExp; channel?: RegExp }> = [
  { host: /^dwamdstream\d+\.akamaized\.net$/, channel: /^DW/i },
  { host: /^cdn-euronews\.akamaized\.net$/, channel: /^Euronews/i },
  { host: /(^|\.)getaj\.net$/, channel: /^AlJazeera/i },
  { host: /^hlspackager\.akamaized\.net$/, path: /\/IRAN_INTERNATIONAL\//, channel: /^IranInternational/i },
  { host: /(^|\.)telewebion\.(ir|com)$/ },
];

const API = 'https://iptv-org.github.io/api';
const CACHE_DIR = path.resolve(process.cwd(), '.cache', 'iptv-org');
const REFRESH_MS = 12 * 60 * 60 * 1000;
const DOWNLOAD_TIMEOUT_MS = 5 * 60 * 1000; // the JSON files are several MB

// Channels shown on the empty-query landing view, in order.
const FEATURED_CHANNELS = [/^DW\./, /^France24\./, /^EuronewsEnglish/, /^AlJazeera/, /^IranInternational/, /^IRINN/, /^IRIB/];

const COUNTRY_ALIASES: Record<string, string> = {
  iran: 'IR', 'ایران': 'IR', persian: 'IR', 'فارسی': 'IR',
  germany: 'DE', france: 'FR', uk: 'UK', britain: 'UK', usa: 'US', america: 'US',
  turkey: 'TR', 'ترکیه': 'TR', qatar: 'QA', afghanistan: 'AF', 'افغانستان': 'AF',
};

interface LiveEntry {
  channelId: string;
  name: string;
  altNames: string[];
  network?: string;
  country?: string;
  categories: string[];
  website?: string;
  logo?: string;
  url: string;
  quality?: string;
  labels: string[];
  haystack: string;
}

let entries: LiveEntry[] = [];
let entriesById = new Map<string, LiveEntry>();
let loadedAt = 0;
let loading: Promise<void> | null = null;

function registrableDomain(host: string): string {
  const parts = host.toLowerCase().split('.');
  const secondLevel = ['co', 'com', 'org', 'net', 'gov', 'ac', 'or', 'ne', 'go'];
  const n = parts.length > 2 && secondLevel.includes(parts[parts.length - 2]) ? 3 : 2;
  return parts.slice(-n).join('.');
}

function isOfficialStream(channel: any, streamUrl: URL): boolean {
  if (streamUrl.protocol !== 'https:') return false;
  if (channel.website) {
    try {
      if (registrableDomain(new URL(channel.website).hostname) === registrableDomain(streamUrl.hostname)) return true;
    } catch {
      // malformed website field
    }
  }
  return OFFICIAL_CDN_STREAMS.some(rule =>
    rule.host.test(streamUrl.hostname) &&
    (!rule.path || rule.path.test(streamUrl.pathname)) &&
    (!rule.channel || rule.channel.test(channel.id)),
  );
}

async function loadDataset(name: string): Promise<any[]> {
  const file = path.join(CACHE_DIR, `${name}.json`);
  let stat: { mtimeMs: number } | null = null;
  try {
    stat = await fs.stat(file);
  } catch {
    // no cache yet
  }
  if (stat && Date.now() - stat.mtimeMs < REFRESH_MS) {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  }
  try {
    const data = await fetchJson<any[]>(`${API}/${name}.json`, { timeoutMs: DOWNLOAD_TIMEOUT_MS });
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(data));
    return data;
  } catch (e) {
    if (stat) return JSON.parse(await fs.readFile(file, 'utf8')); // stale copy beats nothing
    throw e;
  }
}

async function buildIndex(): Promise<void> {
  const [channels, streams, logos] = await Promise.all([
    loadDataset('channels'),
    loadDataset('streams'),
    loadDataset('logos').catch(() => [] as any[]),
  ]);

  const channelById = new Map<string, any>(channels.map(c => [c.id, c]));
  const logoByChannel = new Map<string, string>();
  for (const logo of logos) {
    if (logo?.channel && logo.url && !logoByChannel.has(logo.channel)) logoByChannel.set(logo.channel, logo.url);
  }

  const next: LiveEntry[] = [];
  const seen = new Set<string>();
  for (const s of streams) {
    const channel = channelById.get(s.channel);
    if (!channel || channel.is_nsfw || channel.closed || seen.has(channel.id)) continue;
    // Streams that need a spoofed User-Agent/Referer cannot play in a browser anyway.
    if (s.user_agent || s.referrer) continue;
    let url: URL;
    try {
      url = new URL(s.url);
    } catch {
      continue;
    }
    if (!isOfficialStream(channel, url)) continue;

    seen.add(channel.id);
    const altNames: string[] = channel.alt_names || [];
    const categories: string[] = channel.categories || [];
    next.push({
      channelId: channel.id,
      name: channel.name,
      altNames,
      network: channel.network || undefined,
      country: channel.country,
      categories,
      website: channel.website || undefined,
      logo: logoByChannel.get(channel.id),
      url: s.url,
      quality: s.quality || undefined,
      labels: s.labels || [],
      haystack: [channel.id, channel.name, ...altNames, channel.network, channel.country, ...categories]
        .filter(Boolean).join(' ').toLowerCase(),
    });
  }

  entries = next;
  entriesById = new Map(next.map(e => [e.channelId, e]));
  loadedAt = Date.now();
  console.log(`[live-tv] indexed ${entries.length} official broadcaster streams`);
}

function ensureLoaded(): Promise<void> {
  if (entries.length && Date.now() - loadedAt < REFRESH_MS) return Promise.resolve();
  if (!loading) {
    loading = buildIndex()
      .catch(e => console.warn('[live-tv] failed to load iptv-org data:', e?.message || e))
      .finally(() => { loading = null; });
  }
  // Serve a stale index immediately while a refresh runs.
  return entries.length ? Promise.resolve() : loading;
}

/** Start downloading the channel lists at boot so the first search is fast. */
export function warmLiveTvIndex() {
  void ensureLoaded();
}

function toResult(e: LiveEntry): VideoResult {
  return {
    id: `live:${e.channelId}`,
    provider: 'live',
    kind: 'live',
    title: e.name,
    description: [e.network, e.categories.join(', '), e.labels.join(', ')].filter(Boolean).join(' · ') || undefined,
    posterUrl: e.logo,
    country: e.country,
    categories: e.categories,
    license: 'Official broadcaster stream',
    attribution: e.network || e.name,
    pageUrl: e.website,
  };
}

function score(e: LiveEntry, q: string, country?: string): number {
  const name = e.name.toLowerCase();
  let s = 0;
  if (name === q) s += 1000;
  else if (name.startsWith(q)) s += 500;
  else if (name.includes(q) || e.altNames.some(a => a.toLowerCase().includes(q))) s += 300;
  if (country && e.country === country) s += 200;
  for (const w of q.split(/\s+/)) if (w.length > 1 && e.haystack.includes(w)) s += 50;
  if (e.labels.length) s -= 25; // "Geo-blocked" / "Not 24/7"
  return s;
}

export const liveTvProvider: VideoProvider = {
  name: 'live',
  kind: 'live',
  enabled: () => true,
  async search(query, limit) {
    await ensureLoaded();
    const q = query.trim().toLowerCase();
    const country = COUNTRY_ALIASES[q] || (/^[a-z]{2}$/.test(q) ? q.toUpperCase() : undefined);
    return entries
      .map(e => ({ e, s: score(e, q, country) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map(x => toResult(x.e));
  },
  async featured(limit) {
    await ensureLoaded();
    const picks: LiveEntry[] = [];
    for (const pattern of FEATURED_CHANNELS) {
      const match = entries.find(e => pattern.test(e.channelId) && !picks.includes(e));
      if (match) picks.push(match);
    }
    return picks.slice(0, limit).map(toResult);
  },
  async resolve(channelId): Promise<ResolvedStream | null> {
    await ensureLoaded();
    const e = entriesById.get(channelId);
    if (!e) return null;
    return {
      url: e.url,
      protocol: /\.mpd(\?|$)/i.test(e.url) ? 'mp4' : 'hls',
      isLive: true,
      license: 'Official broadcaster stream',
      attribution: e.network || e.name,
    };
  },
};
