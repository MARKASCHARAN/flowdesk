import { rbacRepository } from '../repositories/rbac.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const rbacService = {
  async getRoles(tenantId) {
    return rbacRepository.findRolesByTenant(tenantId);
  },

  async createRole(tenantId, data) {
    try {
      return await rbacRepository.createRole(tenantId, data);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(
          400,
          'A role with this name already exists in your tenant'
        );
      }
      throw error;
    }
  },

  async updateRole(id, tenantId, data) {
    // Prevent updating the default Admin role if needed
    const existing = await rbacRepository.findRoleById(id, tenantId);
    if (!existing) throw new AppError(404, 'Role not found');

    if (existing.name === 'Admin' && data.name && data.name !== 'Admin') {
      throw new AppError(403, 'Cannot rename the core Admin role');
    }

    try {
      return await rbacRepository.updateRole(id, tenantId, data);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(400, 'A role with this name already exists');
      }
      throw error;
    }
  },

  async deleteRole(id, tenantId) {
    const existing = await rbacRepository.findRoleById(id, tenantId);
    if (!existing) throw new AppError(404, 'Role not found');

    if (existing.name === 'Admin') {
      throw new AppError(403, 'Cannot delete the core Admin role');
    }

    await rbacRepository.deleteRole(id, tenantId);
  },

  async assignRole(tenantId, userId, roleId) {
    // Ensure role exists in tenant
    const role = await rbacRepository.findRoleById(roleId, tenantId);
    if (!role) throw new AppError(404, 'Role not found');

    // Ensure not already assigned
    const existing = await rbacRepository.findMembership(
      tenantId,
      userId,
      roleId
    );
    if (existing) throw new AppError(400, 'User already has this role');

    return rbacRepository.assignRoleToUser(tenantId, userId, roleId);
  },

  async unassignRole(tenantId, userId, roleId) {
    const role = await rbacRepository.findRoleById(roleId, tenantId);
    if (!role) throw new AppError(404, 'Role not found');

    if (role.name === 'Admin') {
      // In a real app, ensure at least 1 admin remains.
      // We will skip that complex logic for MVP.
    }

    await rbacRepository.removeRoleFromUser(tenantId, userId, roleId);
  },
};
