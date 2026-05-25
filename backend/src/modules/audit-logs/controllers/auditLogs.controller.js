import { auditLogsService } from '../services/auditLogs.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const auditLogsController = {
  async getLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      const { logs, total } = await auditLogsService.getLogs(res.locals.tenantId, {
        skip,
        take: limit,
        userId: req.query.userId,
        action: req.query.action,
        resource: req.query.resource,
      });

      sendResponse(res, 200, {
        logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  }
};
