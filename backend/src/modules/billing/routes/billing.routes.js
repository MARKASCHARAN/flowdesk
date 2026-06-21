import { Router } from 'express';
import express from 'express';
import { billingController } from '../controllers/billing.controller.js';
import { billingValidation } from '../validations/billing.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';
import { requireRole } from '../../../api/middlewares/role.js';

const router = Router();

// ----------------------------------------------------------------------
// 1. Billing Management (Requires Auth & Tenant & Admin)
// ----------------------------------------------------------------------
router.use(requireAuth, requireTenant, requireRole(['Admin']));

import { idempotencyMiddleware } from '../../../api/middlewares/idempotency.js';

router.get('/subscription', billingController.getSubscription);
router.post(
  '/checkout',
  idempotencyMiddleware,
  validate(billingValidation.checkout),
  billingController.checkout
);
router.post(
  '/portal',
  validate(billingValidation.portal),
  billingController.portal
);

export default router;
