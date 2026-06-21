import { analyticsService } from '../services/analytics.service.js';

export const analyticsController = {
  async getDashboardMetrics(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const metrics = await analyticsService.getDashboardMetrics(tenantId);
      res.status(200).json({ status: 'success', data: metrics });
    } catch (error) {
      next(error);
    }
  },

  async getTicketTrends(req, res, next) {
    try {
      const tenantId = req.user.tenantId;
      const trends = await analyticsService.getTicketTrends(tenantId);
      res.status(200).json({ status: 'success', data: trends });
    } catch (error) {
      next(error);
    }
  },
};
