import { adminService } from '../services/admin.service.js';

export const adminController = {
  async getAllTenants(req, res, next) {
    try {
      const tenants = await adminService.getAllTenants();
      res.status(200).json({ status: 'success', data: tenants });
    } catch (error) {
      next(error);
    }
  },

  async suspendTenant(req, res, next) {
    try {
      const { tenantId } = req.params;
      const tenant = await adminService.suspendTenant(tenantId);
      res.status(200).json({ status: 'success', data: tenant });
    } catch (error) {
      next(error);
    }
  },
};
