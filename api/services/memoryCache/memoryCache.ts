import { Cache } from "./cacheTypes";

/**
 * Creates a very simple in-memory cache.
 *
 * In a real app this should be stored in a distributed cache like redis, or be calculated
 * in a normalized table and just queried directly.
 */
export function makeMemoryCache<T extends {}>(): Cache<T> {
  const memoryMap: Map<string, T> = new Map();

  function getFromCache(cacheKey: string): T | null {
    if (memoryMap.has(cacheKey)) {
      return memoryMap.get(cacheKey) ?? null;
    }

    return null;
  }

  function addToCache(cacheKey: string, data: T): void {
    memoryMap.set(cacheKey, data);
  }

  return {
    addToCache,
    getFromCache
  };
}
