import Redis from 'ioredis';
import logger from '../utils/logger';

class CacheService {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          retryStrategy(times) {
            if (times > 1) {
              logger.warn('Redis connection failed. Falling back to in-memory cache.');
              return null; // stop retrying
            }
            return 100;
          },
        });

        this.redis.on('error', (err) => {
          logger.warn(`Redis connection error: ${err.message}. Operating via In-Memory fallback.`);
        });

        this.redis.on('connect', () => {
          logger.info('Connected to Redis server successfully.');
        });
      } catch (err: any) {
        logger.warn(`Could not initialize Redis: ${err.message}. Using in-memory cache.`);
        this.redis = null;
      }
    } else {
      logger.info('REDIS_URL not configured. Running with high-performance In-Memory Cache.');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        const val = await this.redis.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        logger.warn('Failed to get from Redis, reading from in-memory.');
      }
    }

    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        logger.warn('Failed to set value to Redis, writing to in-memory.');
      }
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.del(key);
        return;
      } catch (err) {
        logger.warn('Failed to delete key from Redis, deleting in-memory.');
      }
    }

    this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.flushall();
        return;
      } catch (err) {
        logger.warn('Failed to flush Redis.');
      }
    }
    this.memoryCache.clear();
  }

  async isHealthy(): Promise<boolean> {
    if (!this.redis) return true; // Memory cache is always healthy
    if (this.redis.status !== 'ready') return false;
    try {
      const pong = await this.redis.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
