import { Router } from 'express';
import { ticketsController } from '../controllers/tickets.controller.js';
import { ticketsValidation } from '../validations/tickets.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { requireTenant } from '../../../api/middlewares/tenant.js';

const router = Router();

// All Ticket routes require authentication and a valid tenant context
router.use(requireAuth, requireTenant);

router.post('/', validate(ticketsValidation.createTicket), ticketsController.createTicket);
router.get('/', validate(ticketsValidation.listQuery), ticketsController.getTickets);
router.get('/:id', validate(ticketsValidation.paramId), ticketsController.getTicketById);
router.patch('/:id', validate(ticketsValidation.updateTicket), ticketsController.updateTicket);
router.delete('/:id', validate(ticketsValidation.paramId), ticketsController.deleteTicket);

export default router;
