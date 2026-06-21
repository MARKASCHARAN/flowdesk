import { tenantsService } from '../services/tenants.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const tenantsController = {
  async getTenant(req, res, next) {
    try {
      const tenant = await tenantsService.getTenant(res.locals.tenantId);
      sendResponse(res, 200, tenant, 'Tenant retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateTenant(req, res, next) {
    try {
      const tenant = await tenantsService.updateTenant(
        res.locals.tenantId,
        req.body
      );
      sendResponse(res, 200, tenant, 'Tenant updated successfully');
    } catch (error) {
      next(error);
    }
  },
};
