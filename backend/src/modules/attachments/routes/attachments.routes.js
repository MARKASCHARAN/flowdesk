import { Router } from 'express';
import { attachmentsController } from '../controllers/attachments.controller.js';
import { attachmentsValidation } from '../validations/attachments.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { memoryUpload } from '../../../api/middlewares/upload.js';

const router = Router();

// All Attachment routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

// Note: These routes are logically scoped by ticket
router.post(
  '/ticket/:ticketId',
  validate(attachmentsValidation.paramTicketId),
  memoryUpload.single('file'),
  attachmentsController.uploadAttachment
);

router.get(
  '/ticket/:ticketId',
  validate(attachmentsValidation.paramTicketId),
  attachmentsController.getAttachments
);

router.delete(
  '/:id',
  validate(attachmentsValidation.paramId),
  attachmentsController.deleteAttachment
);

export default router;
