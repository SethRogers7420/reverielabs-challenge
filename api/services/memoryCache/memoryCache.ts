import { Cache } from "./cacheTypes";

/**
 * Creates a very simple in-memory cache.
 *
 * In a real app this should be stored in a distributed cache like redis, or be calculated
 * in a normalized table and just queried directly.
 *
 * This cache is generic and different implementations can be swapped out.
 */
export function makeMemoryCache<T extends {}>(): Cache<T> {
  const memoryMap: Map<string, T> = new Map();

  async function getFromCache(cacheKey: string): Promise<T | null> {
    if (memoryMap.has(cacheKey)) {
      return memoryMap.get(cacheKey) ?? null;
    }

    return null;
  }

  async function addToCache(cacheKey: string, data: T): Promise<void> {
    memoryMap.set(cacheKey, data);
  }

  return {
    addToCache,
    getFromCache
  };
}
