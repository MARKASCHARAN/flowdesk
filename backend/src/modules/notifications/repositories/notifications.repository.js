import { prisma } from '../../../infra/db/prisma.js';

export const notificationsRepository = {
  async createNotification(tenantId, userId, data) {
    return prisma.notification.create({
      data: {
        tenantId,
        userId,
        ...data,
      },
    });
  },

  async findNotificationsByUser(tenantId, userId, options = {}) {
    const { skip = 0, take = 50, isRead } = options;
    const where = {
      tenantId,
      userId,
      ...(isRead !== undefined && { isRead }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { tenantId, userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount };
  },

  async markAsRead(id, tenantId, userId) {
    const notification = await prisma.notification.findFirst({ where: { id, tenantId, userId } });
    if (!notification) return null;

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async markAllAsRead(tenantId, userId) {
    return prisma.notification.updateMany({
      where: { tenantId, userId, isRead: false },
      data: { isRead: true },
    });
  },

  async deleteNotification(id, tenantId, userId) {
    const notification = await prisma.notification.findFirst({ where: { id, tenantId, userId } });
    if (!notification) return null;

    return prisma.notification.delete({
      where: { id },
    });
  }
};
