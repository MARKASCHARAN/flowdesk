import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import { logger } from '../infra/logger/index.js';
import { prisma } from '../infra/db/prisma.js';

export const startCleanupWorker = () => {
  const worker = new Worker('cleanup-queue', async (job) => {
    logger.info(`[CleanupWorker] Running cleanup job`);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.notification.deleteMany({
      where: { deletedAt: { lte: thirtyDaysAgo } }
    });

    logger.info(`[CleanupWorker] Hard deleted ${result.count} old notifications`);
  }, { connection: redis });

  worker.on('failed', (job, err) => logger.error(`[CleanupWorker] Job ${job.id} failed: ${err.message}`));
  return worker;
};
