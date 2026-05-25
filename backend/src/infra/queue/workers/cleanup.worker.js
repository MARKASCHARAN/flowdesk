import { Worker } from 'bullmq';
import { redis } from '../../cache/redis.js';
import { logger } from '../../logger/index.js';
import { prisma } from '../../db/prisma.js';

export const startCleanupWorker = () => {
  const worker = new Worker('cleanup-queue', async (job) => {
    logger.info(`[CleanupWorker] Running cleanup job`);
    
    // Example: Hard delete records that were soft-deleted more than 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.notification.deleteMany({
      where: {
        deletedAt: {
          lte: thirtyDaysAgo
        }
      }
    });

    logger.info(`[CleanupWorker] Hard deleted ${result.count} old notifications`);
  }, { connection: redis });

  worker.on('failed', (job, err) => {
    logger.error(`[CleanupWorker] Job ${job.id} failed: ${err.message}`);
  });

  return worker;
};
