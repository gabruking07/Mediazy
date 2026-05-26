import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || '';

export const isRedisConfigured = () => Boolean(redisUrl);

export const createRedisConnection = () => {
  if (!redisUrl) {
    return null;
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
};

let cacheClient;

export const getCacheClient = () => {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!cacheClient) {
    cacheClient = createRedisConnection();
  }

  return cacheClient;
};
