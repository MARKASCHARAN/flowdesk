import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller.js';
import { commentsValidation } from '../validations/comments.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

// All Comments routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

// Note: These routes are meant to be mounted under /tickets in the main app router,
// e.g. app.use('/api/v1/tickets', ticketsRoutes) and these can either be nested
// inside tickets routes, or mounted at the root level like /api/v1/comments.
// We will mount them at /api/v1/comments, but the create/list endpoints require a ticketId param.

// So the endpoints will be:
// POST /api/v1/comments/ticket/:ticketId
// GET /api/v1/comments/ticket/:ticketId
router.post(
  '/ticket/:ticketId',
  validate(commentsValidation.createComment),
  commentsController.createComment
);
router.get(
  '/ticket/:ticketId',
  validate(commentsValidation.listQuery),
  commentsController.getComments
);

// And generic update/delete routes:
// PATCH /api/v1/comments/:id
// DELETE /api/v1/comments/:id
router.patch(
  '/:id',
  validate(commentsValidation.updateComment),
  commentsController.updateComment
);
router.delete(
  '/:id',
  validate(commentsValidation.paramId),
  commentsController.deleteComment
);

export default router;
