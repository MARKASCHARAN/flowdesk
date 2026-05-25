import { prisma } from '../../../infra/db/prisma.js';

export const auditLogsRepository = {
  async createLog(tenantId, userId, action, resource, resourceId, metadata) {
    return prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        resource,
        resourceId,
        metadata: metadata || {}
      }
    });
  },

  async findLogs(tenantId, options = {}) {
    const { skip = 0, take = 50, userId, action, resource } = options;
    const where = {
      tenantId,
      ...(userId && { userId }),
      ...(action && { action }),
      ...(resource && { resource }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
};
