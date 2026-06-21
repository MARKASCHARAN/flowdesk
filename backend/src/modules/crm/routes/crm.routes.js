import { Router } from 'express';
import { crmController } from '../controllers/crm.controller.js';
import { crmValidation } from '../validations/crm.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

// All CRM routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

// --- Customers ---
router.post(
  '/customers',
  validate(crmValidation.createCustomer),
  crmController.createCustomer
);
router.get(
  '/customers',
  validate(crmValidation.listQuery),
  crmController.getCustomers
);
router.get(
  '/customers/:id',
  validate(crmValidation.paramId),
  crmController.getCustomerById
);
router.patch(
  '/customers/:id',
  validate(crmValidation.updateCustomer),
  crmController.updateCustomer
);
router.delete(
  '/customers/:id',
  validate(crmValidation.paramId),
  crmController.deleteCustomer
);

// --- Customer Notes ---
router.post(
  '/customers/:customerId/notes',
  validate(crmValidation.addNote),
  crmController.addNoteToCustomer
);

// --- Leads ---
router.get('/leads', validate(crmValidation.listQuery), crmController.getLeads);
router.post(
  '/customers/:customerId/leads',
  validate(crmValidation.createLead),
  crmController.createLead
);
router.patch(
  '/leads/:id',
  validate(crmValidation.updateLead),
  crmController.updateLead
);

export default router;
