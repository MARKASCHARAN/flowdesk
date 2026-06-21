import { Router } from 'express';
import { searchController } from '../controllers/search.controller.js';
import { searchValidation } from '../validations/search.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

router.use(requireAuth, requireTenant);

// GET /api/v1/search/global?q=query&limit=10
router.get(
  '/global',
  validate(searchValidation.globalSearch),
  searchController.globalSearch
);

export default router;
