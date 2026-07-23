import Redis from "ioredis";

/**
 * Singleton Redis client instance.
 *
 * Uses the same hot-reload safety pattern as the Prisma client.
 */

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env["REDIS_URL"] ?? "redis://localhost:6379";

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  client.on("error", (err) => {
    if (process.env["NODE_ENV"] === "development") {
      console.warn("[Redis warning]:", err.message);
    }
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForRedis.redis = redis;
}

/**
 * Type-safe cache helpers with automatic JSON serialization.
 */
export const cache = {
  /**
   * Get a cached value by key. Returns null if not found or expired.
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (value === null) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  /**
   * Set a cached value with an optional TTL (in seconds).
   * Defaults to 1 hour if no TTL is provided.
   */
  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, serialized);
  },

  /**
   * Delete a cached value by key.
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  /**
   * Delete all keys matching a pattern.
   * Use with caution in production.
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

export { Redis };
