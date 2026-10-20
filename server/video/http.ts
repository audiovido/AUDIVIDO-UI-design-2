/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const USER_AGENT = 'AudioVido/1.0 (open-licensed video aggregator)';

export async function fetchJson<T = any>(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const { timeoutMs = 8000, headers, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...(headers || {}) },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

/** Small in-memory TTL cache shared by the providers. */
export class TtlCache<V> {
  private store = new Map<string, { value: V; expires: number }>();
  constructor(private ttlMs: number, private maxEntries = 500) {}

  get(key: string): V | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expires < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: V) {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }
}

export function toHttps(url: string): string {
  return url.replace(/^http:\/\//i, 'https://');
}

export function stripHtml(text: string | undefined, max = 400): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

export function parseYear(value: unknown): number | undefined {
  const m = String(value ?? '').match(/\b(1[89]\d\d|20\d\d)\b/);
  return m ? Number(m[1]) : undefined;
}

/** "1:23:45" / "23:45" / seconds-as-string → seconds */
export function parseDuration(value: unknown): number | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s));
  const parts = s.split(':').map(Number);
  if (parts.some(isNaN)) return undefined;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}
