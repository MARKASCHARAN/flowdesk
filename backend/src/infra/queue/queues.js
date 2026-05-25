import { Queue } from 'bullmq';
import { redis } from '../cache/redis.js';

const connection = redis;

// Standard queue options (retry strategies, backoff)
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: true, // Keep redis memory clean
  removeOnFail: false, // Keep failed jobs for inspection/dead letter
};

export const createQueue = (queueName) => {
  return new Queue(queueName, { 
    connection,
    defaultJobOptions
  });
};

// Define core system queues
export const emailQueue = createQueue('email-queue');
export const invoiceQueue = createQueue('invoice-queue');
export const exportQueue = createQueue('export-queue');
export const cleanupQueue = createQueue('cleanup-queue');
export const reminderQueue = createQueue('reminder-queue');
export const webhookQueue = createQueue('webhook-queue');
