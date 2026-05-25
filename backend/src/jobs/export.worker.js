import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import logger from '../infra/logger/index.js';
import { notificationsService } from '../modules/notifications/services/notifications.service.js';

export const startExportWorker = () => {
  const worker = new Worker('export-queue', async (job) => {
    logger.info(`[ExportWorker] Processing export for tenant ${job.data.tenantId}, user ${job.data.userId}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    await notificationsService.createNotification(job.data.tenantId, job.data.userId, {
      type: 'export_complete',
      title: 'Export Ready',
      body: 'Your data export is ready for download.',
    });

    logger.info(`[ExportWorker] Export completed for user ${job.data.userId}`);
  }, { connection: redis });

  worker.on('failed', (job, err) => logger.error(`[ExportWorker] Job ${job.id} failed: ${err.message}`));
  return worker;
};
