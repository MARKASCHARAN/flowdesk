import { Router } from 'express';
import { tenantsController } from '../controllers/tenants.controller.js';
import { tenantsValidation } from '../validations/tenants.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';

const router = Router();

// All tenant routes require authentication, a valid tenant context, and Admin role
router.use(requireAuth, requireTenant, requireRole(['Admin']));

// Tenant Settings Management
router.get('/', tenantsController.getTenant);
router.patch('/', validate(tenantsValidation.updateTenant), tenantsController.updateTenant);

export default router;
