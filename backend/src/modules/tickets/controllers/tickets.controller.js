import { ticketsService } from '../services/tickets.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const ticketsController = {
  async createTicket(req, res, next) {
    try {
      const ticket = await ticketsService.createTicket(
        res.locals.tenantId,
        req.user.id,
        req.body
      );
      sendResponse(res, 201, ticket, 'Ticket created successfully');
    } catch (error) {
      next(error);
    }
  },

  async getTickets(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const { tickets, nextCursor, total } = await ticketsService.getTickets(
        res.locals.tenantId,
        {
          take: limit,
          cursor,
          search: req.query.search,
          status: req.query.status,
          priority: req.query.priority,
          assigneeId: req.query.assigneeId,
          customerId: req.query.customerId,
        }
      );

      sendResponse(res, 200, {
        tickets,
        pagination: {
          nextCursor,
          limit,
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getTicketById(req, res, next) {
    try {
      const ticket = await ticketsService.getTicketById(
        req.params.id,
        res.locals.tenantId
      );
      sendResponse(res, 200, ticket);
    } catch (error) {
      next(error);
    }
  },

  async updateTicket(req, res, next) {
    try {
      const ticket = await ticketsService.updateTicket(
        req.params.id,
        res.locals.tenantId,
        req.body
      );
      sendResponse(res, 200, ticket, 'Ticket updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTicket(req, res, next) {
    try {
      await ticketsService.deleteTicket(req.params.id, res.locals.tenantId);
      sendResponse(res, 200, null, 'Ticket deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async restoreTicket(req, res, next) {
    try {
      const ticket = await ticketsService.restoreTicket(
        req.params.id,
        res.locals.tenantId
      );
      sendResponse(res, 200, ticket, 'Ticket restored successfully');
    } catch (error) {
      next(error);
    }
  },
};
