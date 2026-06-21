import { auditLogsRepository } from '../repositories/auditLogs.repository.js';

export const auditLogsService = {
  // Used internally by other modules to log critical changes
  async logEvent(tenantId, userId, action, resource, resourceId, metadata) {
    const validUserId =
      userId === 'system' || userId === 'SYSTEM' ? null : userId;
    // Fire-and-forget logging to not block the request
    auditLogsRepository
      .createLog(tenantId, validUserId, action, resource, resourceId, metadata)
      .catch((err) => {
        console.error('Failed to write audit log:', err);
      });
  },

  async getLogs(tenantId, options) {
    return auditLogsRepository.findLogs(tenantId, options);
  },
};
