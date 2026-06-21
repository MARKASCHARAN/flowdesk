import { Worker } from 'bullmq';
import { redis } from '../cache/redis.js';
import logger from '../../infra/logger/index.js';

/**
 * Worker Factory
 *
 * Industry standard: Standardize worker creation so every background worker automatically
 * utilizes the shared Redis connection and binds standard lifecycle observability events
 * (logging completions and failures).
 *
 * @param {string} queueName - Name of the queue this worker should process
 * @param {function} processor - Async function that handles the job execution
 * @param {object} options - Optional BullMQ worker settings (concurrency, rate limiting, etc.)
 * @returns {Worker} BullMQ Worker instance
 */
export const createWorker = (queueName, processor, options = {}) => {
  const worker = new Worker(queueName, processor, {
    connection: redis,
    ...options,
  });

  // Automatically log successful job executions
  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed in queue ${queueName}`);
  });

  // Automatically log job failures and trace errors
  worker.on('failed', (job, err) => {
    logger.error(err, `Job ${job?.id} failed in queue ${queueName}`);
  });

  return worker;
};
