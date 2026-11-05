import { ACCOUNT_CACHE_MAX_ENTRIES, ACCOUNT_CACHE_TTL_MS } from "../configuration/constants";

type Entry = { handle: string; expiresAt: number };

const entries = new Map<string, Entry>();

export function getCachedHandle(tokenHash: string, now = Date.now()): string | null {
  const entry = entries.get(tokenHash);
  if (entry === undefined) {
    return null;
  }
  if (entry.expiresAt <= now) {
    entries.delete(tokenHash);
    return null;
  }
  return entry.handle;
}

export function cacheHandle(tokenHash: string, handle: string, now = Date.now()): void {
  if (entries.size >= ACCOUNT_CACHE_MAX_ENTRIES) {
    entries.clear();
  }
  entries.set(tokenHash, { handle, expiresAt: now + ACCOUNT_CACHE_TTL_MS });
}

export function clearAccountCache(): void {
  entries.clear();
}
