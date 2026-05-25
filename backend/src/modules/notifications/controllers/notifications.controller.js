import { notificationsService } from '../services/notifications.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const notificationsController = {
  async getNotifications(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      const options = {
        skip,
        take: limit,
      };

      if (req.query.isRead !== undefined) {
        options.isRead = req.query.isRead === 'true';
      }

      const { notifications, total, unreadCount } = await notificationsService.getNotifications(
        res.locals.tenantId,
        req.user.id,
        options
      );

      sendResponse(res, 200, {
        notifications,
        unreadCount,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationsService.markAsRead(
        req.params.id,
        res.locals.tenantId,
        req.user.id
      );
      sendResponse(res, 200, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await notificationsService.markAllAsRead(res.locals.tenantId, req.user.id);
      sendResponse(res, 200, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  },

  async deleteNotification(req, res, next) {
    try {
      await notificationsService.deleteNotification(
        req.params.id,
        res.locals.tenantId,
        req.user.id
      );
      sendResponse(res, 200, null, 'Notification deleted');
    } catch (error) {
      next(error);
    }
  }
};
