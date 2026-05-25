import { prisma } from '../../../infra/db/prisma.js';

export const tenantsRepository = {
  async findById(id) {
    return prisma.tenant.findFirst({
      where: { id },
    });
  },

  async update(id, data) {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  },
};
