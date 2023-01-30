export type Cache<T extends {}> = {
  getFromCache: (cacheKey: string) => Promise<T | null>;
  addToCache: (cacheKey: string, data: T) => Promise<void>;
};
