import { reportingService } from '../services/reporting.service.js';

export const reportingController = {
  async requestExport(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const userId = req.user.id;
      const { type } = req.body; // e.g., 'tickets', 'customers'

      // We dispatch a job to the background queue to handle the heavy export.
      // This is crucial so the API responds instantly.
      const jobId = await reportingService.queueExportJob(
        tenantId,
        userId,
        type
      );

      res.status(202).json({
        status: 'success',
        message:
          'Export job queued successfully. You will receive an email when it is ready.',
        data: { jobId },
      });
    } catch (error) {
      next(error);
    }
  },
};
