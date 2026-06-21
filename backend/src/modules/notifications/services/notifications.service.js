import { notificationsRepository } from '../repositories/notifications.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { prisma } from '../../../infra/db/prisma.js';
import { getSocketServer } from '../../../infra/websocket/socket.js';

export const notificationsService = {
  // Can be called internally by other modules (e.g. when a ticket is assigned)
  async createNotification(tenantId, userId, data) {
    const notification = await notificationsRepository.createNotification(
      tenantId,
      userId,
      data
    );

    // Push the notification in real-time to the targeted user's personal room
    const io = getSocketServer();
    if (io) {
      io.to(`user_${userId}`).emit('notification:new', notification);
    }

    return notification;
  },

  async getNotifications(tenantId, userId, options) {
    return notificationsRepository.findNotificationsByUser(
      tenantId,
      userId,
      options
    );
  },

  async markAsRead(id, tenantId, userId) {
    const notification = await notificationsRepository.markAsRead(
      id,
      tenantId,
      userId
    );
    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }
    return notification;
  },

  async markAllAsRead(tenantId, userId) {
    return notificationsRepository.markAllAsRead(tenantId, userId);
  },

  async deleteNotification(id, tenantId, userId) {
    const notification = await notificationsRepository.deleteNotification(
      id,
      tenantId,
      userId
    );
    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }
  },
};
