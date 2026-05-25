import { Router } from 'express';
import { reportingController } from '../controllers/reporting.controller.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

router.use(requireAuth, requireTenant);

// Trigger a CSV export
router.post('/export', reportingController.requestExport);

export default router;
