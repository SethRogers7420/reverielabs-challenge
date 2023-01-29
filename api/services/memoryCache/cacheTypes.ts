export type Cache<T extends {}> = {
  getFromCache: (cacheKey: string) => T | null;
  addToCache: (cacheKey: string, data: T) => void;
};
