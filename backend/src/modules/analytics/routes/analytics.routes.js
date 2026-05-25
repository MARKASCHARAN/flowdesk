import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';

const router = Router();

router.use(requireAuth, requireTenant, requireRole(['Admin', 'Manager']));

router.get('/dashboard', analyticsController.getDashboardMetrics);
router.get('/tickets', analyticsController.getTicketTrends);

export default router;
