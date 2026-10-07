import { redis } from "./redis";

/**
 * Global cache helper for Redis operations with JSON serialization.
 * Used by all roles (mobilizer, admin, superadmin, candidate, instructor, hr).
 * Each role uses its own key prefix from constants/xxx-keys/.
 */
export const cache = {
  /**
   * Get cached value and parse JSON.
   * Returns null on cache miss or error (fail-open).
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[Cache] GET error for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set value with TTL (seconds) and JSON serialization.
   * Fail-open: logs error but doesn't throw.
   */
  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error(`[Cache] SET error for key "${key}":`, error);
    }
  },

  /**
   * Delete a single key.
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`[Cache] DEL error for key "${key}":`, error);
    }
  },

  /**
   * Delete all keys matching a pattern using SCAN.
   * Use sparingly — SCAN is O(N) across keyspace.
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== "0");
    } catch (error) {
      console.error(`[Cache] DEL PATTERN error for pattern "${pattern}":`, error);
    }
  },

  /**
   * Invalidate all mobilizer cache for a center.
   * Call from mutation endpoints (change-enquiry-status, enroll-candidate, etc.)
   */
  async invalidateMobilizerCenter(centerId: string): Promise<void> {
    await Promise.all([
      this.del(`mob:stats:${centerId}`),
      this.del(`mob:charts:${centerId}`),
      this.del(`mob:enquiry-stats:${centerId}`),
      this.delPattern(`mob:enroll-analytics:${centerId}:*`),
      this.delPattern(`mob:enquiries:${centerId}:*`),
      this.delPattern(`mob:candidates:${centerId}:*`),
    ]);
  },
};

/**
 * High-level wrapper: check cache → execute fn → store → return.
 * Usage:
 *   const data = await withCache(key, 30, async () => await computeExpensiveQuery());
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  const data = await fn();
  await cache.set(key, data, ttlSeconds);
  return data;
}