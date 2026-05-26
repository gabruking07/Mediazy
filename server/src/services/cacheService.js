import crypto from 'node:crypto';
import { getCacheClient } from '../config/redis.js';

const defaultTtlSeconds = Number(process.env.REDIS_CACHE_TTL_SECONDS || 900);

export const cacheKey = (...parts) => {
  const raw = parts.map((part) => JSON.stringify(part)).join(':');
  const digest = crypto.createHash('sha256').update(raw).digest('hex');
  return `mediazy:${digest}`;
};

export const getCachedJson = async (key) => {
  const redis = getCacheClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Redis cache read failed:', error.message);
    return null;
  }
};

export const setCachedJson = async (key, value, ttlSeconds = defaultTtlSeconds) => {
  const redis = getCacheClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    console.warn('Redis cache write failed:', error.message);
  }
};
