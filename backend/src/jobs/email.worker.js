import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import { logger } from '../infra/logger/index.js';

export const startEmailWorker = () => {
  const worker = new Worker('email-queue', async (job) => {
    logger.info(`[EmailWorker] Processing job ${job.id} for ${job.data.to}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (job.data.triggerFail) throw new Error('Simulated email failure');
    logger.info(`[EmailWorker] Successfully sent email to ${job.data.to}`);
  }, { connection: redis });

  worker.on('failed', (job, err) => logger.error(`[EmailWorker] Job ${job.id} failed: ${err.message}`));
  return worker;
};
