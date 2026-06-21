import Redis from 'ioredis';
import { config } from '../../infra/config/env.js';
import logger from '../../infra/logger/index.js';

/**
 * Central Redis Client
 *
 * Industry standard: Maintain a single Redis connection pool across the application
 * for caching, queue management (BullMQ), and potential Pub/Sub (WebSockets).
 * `maxRetriesPerRequest: null` is strictly required by BullMQ to prevent the worker
 * from stalling when Redis temporarily drops the connection.
 */
export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.error(err, 'Redis connection error');
});
