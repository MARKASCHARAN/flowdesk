import { tenantsRepository } from '../repositories/tenants.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const tenantsService = {
  async getTenant(tenantId) {
    const tenant = await tenantsRepository.findById(tenantId);
    if (!tenant) throw new AppError(404, 'Tenant not found');
    return tenant;
  },

  async updateTenant(tenantId, data) {
    // Basic validation could happen here, e.g. checking domain uniqueness,
    // but Prisma will also throw a unique constraint error if it's taken.
    try {
      const updatedTenant = await tenantsRepository.update(tenantId, data);
      return updatedTenant;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(400, 'Slug or domain is already taken');
      }
      throw error;
    }
  },
};
