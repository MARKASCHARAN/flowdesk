import { Queue } from 'bullmq';
import { redis } from '../cache/redis.js';

/**
 * We reuse the existing Redis connection to prevent opening redundant sockets.
 */
const connection = redis;

/**
 * Queue Factory
 * 
 * Industry standard: Encapsulate the creation of Queues to ensure they all 
 * share the same Redis connection pool and standard configuration.
 * BullMQ handles offloading heavy operations (like emails) to background processes.
 * 
 * @param {string} queueName - Name of the queue (e.g., 'email-queue', 'report-queue')
 * @returns {Queue} BullMQ Queue instance
 */
export const createQueue = (queueName) => {
  return new Queue(queueName, { connection });
};

// Export a default queue for generic async jobs
export const defaultQueue = createQueue('default-queue');
