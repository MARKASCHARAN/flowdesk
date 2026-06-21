import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller.js';
import { notificationsValidation } from '../validations/notifications.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

// All Notification routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

// Only users can manage their own notifications
router.get(
  '/',
  validate(notificationsValidation.listQuery),
  notificationsController.getNotifications
);
router.post('/mark-all-read', notificationsController.markAllAsRead);
router.patch(
  '/:id/read',
  validate(notificationsValidation.paramId),
  notificationsController.markAsRead
);
router.delete(
  '/:id',
  validate(notificationsValidation.paramId),
  notificationsController.deleteNotification
);

export default router;
