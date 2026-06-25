// ── localStorage Cache ────────────────────────────────────────────────
// Simple TTL-based cache for API responses. Guards against server-side
// execution (SSR/prerender) where localStorage is unavailable.

/**
 * Store data in localStorage with an expiry timestamp.
 * No-ops during server-side rendering.
 *
 * @param key Cache key (namespaced per-call-site to avoid collisions)
 * @param data Arbitrary data to serialise
 * @param ttl Time-to-live in milliseconds (default 1 hour)
 */
export function setCache<T>(key: string, data: T, ttl: number = 3600000): void {
  if (typeof window === 'undefined') {
    return;
  }
  const now = new Date().getTime();
  const item = {
    data: data,
    expiry: now + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Retrieve data from localStorage if it has not expired.
 * Removes expired entries proactively.
 *
 * @param key Cache key to look up
 * @returns The cached value, or null if missing or expired
 */
export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.data;
}