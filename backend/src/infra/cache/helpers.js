import { redis } from './redis.js';

export const setCache = async (key, value, ttlSeconds = 3600) => {
  const data = JSON.stringify(value);
  await redis.set(key, data, 'EX', ttlSeconds);
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  if (!data) return null;
  return JSON.parse(data);
};

export const deleteCache = async (key) => {
  await redis.del(key);
};

export const clearCachePattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
