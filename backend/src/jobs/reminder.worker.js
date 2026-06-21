import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import logger from '../infra/logger/index.js';
import { notificationsService } from '../modules/notifications/services/notifications.service.js';

export const startReminderWorker = () => {
  const worker = new Worker(
    'reminder-queue',
    async (job) => {
      logger.info(
        `[ReminderWorker] Processing reminder for ticket ${job.data.ticketId}`
      );

      await notificationsService.createNotification(
        job.data.tenantId,
        job.data.assigneeId,
        {
          type: 'ticket_reminder',
          title: 'Ticket Reminder / SLA',
          body: `Ticket "${job.data.ticketTitle}" needs your attention.`,
        }
      );

      logger.info(
        `[ReminderWorker] Reminder sent to user ${job.data.assigneeId}`
      );
    },
    { connection: redis }
  );

  worker.on('failed', (job, err) =>
    logger.error(`[ReminderWorker] Job ${job.id} failed: ${err.message}`)
  );
  return worker;
};
