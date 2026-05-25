import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireSystemAdmin } from '../../../api/middlewares/role.js';

const router = Router();

// Note: SystemAdmin is a special check (e.g. users with isSuperAdmin=true or similar)
// We will mock requireSystemAdmin to just check if the user is authorized.
router.use(requireAuth, requireSystemAdmin);

router.get('/tenants', adminController.getAllTenants);
router.patch('/tenants/:tenantId/suspend', adminController.suspendTenant);

export default router;
