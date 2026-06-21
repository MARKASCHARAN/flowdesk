import { exportQueue } from '../../../infra/queue/bullmq.js';
import { auditLogsService } from '../../audit-logs/services/auditLogs.service.js';

export const reportingService = {
  async queueExportJob(tenantId, userId, type) {
    // Dispatch the job to BullMQ
    const job = await exportQueue.add('export-data', {
      tenantId,
      userId,
      type,
    });

    // Log the request
    auditLogsService
      .logEvent(tenantId, userId, 'export.requested', 'Report', job.id, {
        type,
      })
      .catch(() => {});

    return job.id;
  },
};
