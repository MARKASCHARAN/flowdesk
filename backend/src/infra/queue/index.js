import { logger } from '../logger/index.js';

// Export Queues
export {
  emailQueue,
  invoiceQueue,
  exportQueue,
  cleanupQueue,
  reminderQueue
} from './queues.js';

// Import Workers
import { startEmailWorker } from './workers/email.worker.js';
import { startInvoiceWorker } from './workers/invoice.worker.js';
import { startExportWorker } from './workers/export.worker.js';
import { startCleanupWorker } from './workers/cleanup.worker.js';
import { startReminderWorker } from './workers/reminder.worker.js';

/**
 * Initializes all BullMQ workers.
 * In a real production setup, you might run these in a separate worker process 
 * (e.g., node worker.js) instead of the main API server to prevent blocking the event loop.
 */
export const startAllWorkers = () => {
  logger.info('[Queue] Starting BullMQ workers...');
  
  startEmailWorker();
  startInvoiceWorker();
  startExportWorker();
  startCleanupWorker();
  startReminderWorker();

  logger.info('[Queue] All workers started successfully');
};
