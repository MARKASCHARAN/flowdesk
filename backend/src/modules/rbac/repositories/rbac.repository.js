import { prisma } from '../../../infra/db/prisma.js';

export const rbacRepository = {
  // --- ROLES ---
  async createRole(tenantId, data) {
    return prisma.role.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
      },
    });
  },

  async findRolesByTenant(tenantId) {
    return prisma.role.findMany({
      where: { tenantId },
      include: {
        _count: { select: { memberships: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findRoleById(id, tenantId) {
    return prisma.role.findFirst({
      where: { id, tenantId },
    });
  },

  async updateRole(id, tenantId, data) {
    // Ensure role exists and belongs to tenant
    const role = await prisma.role.findFirst({ where: { id, tenantId } });
    if (!role) return null;

    return prisma.role.update({
      where: { id },
      data,
    });
  },

  async deleteRole(id, tenantId) {
    const role = await prisma.role.findFirst({ where: { id, tenantId } });
    if (!role) return null;

    return prisma.role.delete({ where: { id } });
  },

  // --- MEMBERSHIPS (User -> Role mapping) ---
  async assignRoleToUser(tenantId, userId, roleId) {
    // Upsert or create? Since it's many-to-many via Membership, we create one.
    return prisma.membership.create({
      data: {
        tenantId,
        userId,
        roleId,
      },
    });
  },

  async removeRoleFromUser(tenantId, userId, roleId) {
    return prisma.membership.deleteMany({
      where: {
        tenantId,
        userId,
        roleId,
      },
    });
  },

  async findMembership(tenantId, userId, roleId) {
    return prisma.membership.findFirst({
      where: { tenantId, userId, roleId },
    });
  },
};
