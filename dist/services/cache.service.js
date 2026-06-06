"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
class CacheService {
    redis = null;
    memoryCache = new Map();
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl) {
            try {
                this.redis = new ioredis_1.default(redisUrl, {
                    maxRetriesPerRequest: 1,
                    retryStrategy(times) {
                        if (times > 1) {
                            logger_1.default.warn('Redis connection failed. Falling back to in-memory cache.');
                            return null; // stop retrying
                        }
                        return 100;
                    },
                });
                this.redis.on('error', (err) => {
                    logger_1.default.warn(`Redis connection error: ${err.message}. Operating via In-Memory fallback.`);
                });
                this.redis.on('connect', () => {
                    logger_1.default.info('Connected to Redis server successfully.');
                });
            }
            catch (err) {
                logger_1.default.warn(`Could not initialize Redis: ${err.message}. Using in-memory cache.`);
                this.redis = null;
            }
        }
        else {
            logger_1.default.info('REDIS_URL not configured. Running with high-performance In-Memory Cache.');
        }
    }
    async get(key) {
        if (this.redis && this.redis.status === 'ready') {
            try {
                const val = await this.redis.get(key);
                return val ? JSON.parse(val) : null;
            }
            catch (err) {
                logger_1.default.warn('Failed to get from Redis, reading from in-memory.');
            }
        }
        const cached = this.memoryCache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        return cached.value;
    }
    async set(key, value, ttlSeconds = 300) {
        if (this.redis && this.redis.status === 'ready') {
            try {
                await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
                return;
            }
            catch (err) {
                logger_1.default.warn('Failed to set value to Redis, writing to in-memory.');
            }
        }
        this.memoryCache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
    async del(key) {
        if (this.redis && this.redis.status === 'ready') {
            try {
                await this.redis.del(key);
                return;
            }
            catch (err) {
                logger_1.default.warn('Failed to delete key from Redis, deleting in-memory.');
            }
        }
        this.memoryCache.delete(key);
    }
    async clear() {
        if (this.redis && this.redis.status === 'ready') {
            try {
                await this.redis.flushall();
                return;
            }
            catch (err) {
                logger_1.default.warn('Failed to flush Redis.');
            }
        }
        this.memoryCache.clear();
    }
    async isHealthy() {
        if (!this.redis)
            return true; // Memory cache is always healthy
        if (this.redis.status !== 'ready')
            return false;
        try {
            const pong = await this.redis.ping();
            return pong === 'PONG';
        }
        catch {
            return false;
        }
    }
}
exports.cacheService = new CacheService();
exports.default = exports.cacheService;
//# sourceMappingURL=cache.service.js.map