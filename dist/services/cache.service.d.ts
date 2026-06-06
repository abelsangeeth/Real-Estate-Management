declare class CacheService {
    private redis;
    private memoryCache;
    constructor();
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    clear(): Promise<void>;
    isHealthy(): Promise<boolean>;
}
export declare const cacheService: CacheService;
export default cacheService;
