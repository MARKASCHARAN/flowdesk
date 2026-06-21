import { Router } from 'express';
import { auditLogsController } from '../controllers/auditLogs.controller.js';
import { auditLogsValidation } from '../validations/auditLogs.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';

const router = Router();

router.use(requireAuth, requireTenant, requireRole(['Admin'])); // Only admins can see audit logs

// GET /api/v1/audit-logs
router.get(
  '/',
  validate(auditLogsValidation.listQuery),
  auditLogsController.getLogs
);

export default router;
