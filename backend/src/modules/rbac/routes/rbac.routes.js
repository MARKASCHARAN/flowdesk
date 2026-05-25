import { Router } from 'express';
import { rbacController } from '../controllers/rbac.controller.js';
import { rbacValidation } from '../validations/rbac.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';

const router = Router();

// All RBAC routes require authentication, a valid tenant context, and Admin role
router.use(requireAuth, requireTenant, requireRole(['Admin']));

// Roles Management
router.get('/roles', rbacController.getRoles);
router.post('/roles', validate(rbacValidation.createRole), rbacController.createRole);
router.patch('/roles/:id', validate(rbacValidation.updateRole), rbacController.updateRole);
router.delete('/roles/:id', validate(rbacValidation.roleIdParam), rbacController.deleteRole);

// Memberships Management
router.post('/memberships/assign', validate(rbacValidation.assignRole), rbacController.assignRole);
router.post('/memberships/unassign', validate(rbacValidation.assignRole), rbacController.unassignRole);

export default router;
