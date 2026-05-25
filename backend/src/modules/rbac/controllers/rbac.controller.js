import { rbacService } from '../services/rbac.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const rbacController = {
  async getRoles(req, res, next) {
    try {
      const roles = await rbacService.getRoles(res.locals.tenantId);
      sendResponse(res, 200, roles, 'Roles retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createRole(req, res, next) {
    try {
      const role = await rbacService.createRole(res.locals.tenantId, req.body);
      sendResponse(res, 201, role, 'Role created successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateRole(req, res, next) {
    try {
      const role = await rbacService.updateRole(req.params.id, res.locals.tenantId, req.body);
      sendResponse(res, 200, role, 'Role updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteRole(req, res, next) {
    try {
      await rbacService.deleteRole(req.params.id, res.locals.tenantId);
      sendResponse(res, 200, null, 'Role deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async assignRole(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      const membership = await rbacService.assignRole(res.locals.tenantId, userId, roleId);
      sendResponse(res, 201, membership, 'Role assigned successfully');
    } catch (error) {
      next(error);
    }
  },

  async unassignRole(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      await rbacService.unassignRole(res.locals.tenantId, userId, roleId);
      sendResponse(res, 200, null, 'Role unassigned successfully');
    } catch (error) {
      next(error);
    }
  }
};
