import { prisma } from '../../../infra/db/prisma.js';

export const usersRepository = {
  async findUserById(id, tenantId) {
    return prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        memberships: {
          include: {
            role: {
              select: { name: true }
            }
          }
        },
      },
    });
  },

  async updateUserProfile(id, tenantId, data) {
    // Ensure the user exists in this tenant before updating
    const user = await prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!user) return null;

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        status: true,
      },
    });
  },

  async findUsersByTenant(tenantId, options = {}) {
    const { skip = 0, take = 10, search } = options;
    
    const where = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          status: true,
          memberships: {
            include: { role: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },
};
