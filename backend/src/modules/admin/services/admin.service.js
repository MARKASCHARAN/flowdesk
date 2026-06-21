import { prisma } from '../../../infra/db/prisma.js';

export const adminService = {
  async getAllTenants() {
    return prisma.tenant.findMany({
      include: {
        subscriptions: true,
      },
    });
  },

  async suspendTenant(tenantId) {
    // For simplicity, we can update a status field on the tenant.
    // If you don't have a status field yet, we will just update the plan to 'suspended'
    return prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: 'suspended' },
    });
  },
};
