import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import { logger } from '../infra/logger/index.js';

export const startInvoiceWorker = () => {
  const worker = new Worker('invoice-queue', async (job) => {
    logger.info(`[InvoiceWorker] Generating invoice ${job.data.invoiceId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    logger.info(`[InvoiceWorker] Successfully generated invoice ${job.data.invoiceId}`);
  }, { connection: redis });

  worker.on('failed', (job, err) => logger.error(`[InvoiceWorker] Job ${job.id} failed: ${err.message}`));
  return worker;
};
