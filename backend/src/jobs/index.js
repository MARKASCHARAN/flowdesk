import logger from '../infra/logger/index.js';

import { startEmailWorker } from './email.worker.js';
import { startInvoiceWorker } from './invoice.worker.js';
import { startExportWorker } from './export.worker.js';
import { startCleanupWorker } from './cleanup.worker.js';
import { startReminderWorker } from './reminder.worker.js';

export const startAllWorkers = () => {
  logger.info('[Jobs] Starting BullMQ workers...');
  
  startEmailWorker();
  startInvoiceWorker();
  startExportWorker();
  startCleanupWorker();
  startReminderWorker();

  logger.info('[Jobs] All workers started successfully');
};
