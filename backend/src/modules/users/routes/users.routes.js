import { Router } from 'express';
import { usersController } from '../controllers/users.controller.js';
import { usersValidation } from '../validations/users.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';
import { memoryUpload } from '../../../api/middlewares/upload.js';

const router = Router();

// All user routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

// Profile Management (Self)
router.get('/me', usersController.getProfile);
router.patch(
  '/me',
  validate(usersValidation.updateProfile),
  usersController.updateProfile
);
router.post(
  '/me/avatar',
  memoryUpload.single('avatar'),
  usersController.uploadAvatar
);

// Team Management (Admin / Manager only)
router.get(
  '/team',
  requireRole(['Admin', 'Manager']),
  validate(usersValidation.getTeamMembers),
  usersController.getTeamMembers
);
router.patch(
  '/:id/status',
  requireRole(['Admin']),
  validate(usersValidation.updateStatus),
  usersController.updateStatus
);

export default router;
