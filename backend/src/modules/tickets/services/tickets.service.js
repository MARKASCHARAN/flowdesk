import { ticketsRepository } from '../repositories/tickets.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { uploadFileToS3 } from '../../../infra/storage/s3.js';
import { getSocketServer } from '../../../infra/websocket/socket.js';
import { auditLogsService } from '../../audit-logs/services/auditLogs.service.js';
import crypto from 'crypto';
import path from 'path';

export const ticketsService = {
  async createTicket(tenantId, createdBy, data) {
    // Basic defaults
    const ticketData = {
      ...data,
      status: 'open', // Default status
    };
    const ticket = await ticketsRepository.createTicket(
      tenantId,
      createdBy,
      ticketData
    );

    // Alert online tenant admins/agents
    const io = getSocketServer();
    if (io) {
      io.to(`tenant_${tenantId}`).emit('ticket:created', ticket);
    }

    auditLogsService.logEvent(
      tenantId,
      createdBy,
      'create',
      'Ticket',
      ticket.id,
      { title: ticket.title }
    );

    // Trigger Outgoing Webhook
    import('../../webhooks/services/webhook.service.js').then(
      ({ webhookService }) => {
        webhookService.dispatchEvent(tenantId, 'ticket.created', {
          ticketId: ticket.id,
          title: ticket.title,
          priority: ticket.priority,
        });
      }
    );

    return ticket;
  },

  async getTickets(tenantId, options) {
    return ticketsRepository.findTickets(tenantId, options);
  },

  async getTicketById(id, tenantId) {
    const ticket = await ticketsRepository.findTicketById(id, tenantId);
    if (!ticket) throw new AppError(404, 'Ticket not found');
    return ticket;
  },

  async updateTicket(id, tenantId, data) {
    // If status is resolved or closed, we can auto-set the timestamp
    if (data.status === 'resolved') {
      data.resolvedAt = new Date();
    }
    if (data.status === 'closed') {
      data.closedAt = new Date();
    }

    const ticket = await ticketsRepository.updateTicket(id, tenantId, data);
    if (!ticket) throw new AppError(404, 'Ticket not found');

    // Broadcast update to anyone viewing the ticket
    const io = getSocketServer();
    if (io) {
      io.to(`ticket_${id}`).emit('ticket:updated', ticket);
    }

    return ticket;
  },

  async deleteTicket(id, tenantId) {
    const ticket = await ticketsRepository.deleteTicket(id, tenantId);
    if (!ticket) throw new AppError(404, 'Ticket not found');
  },

  async restoreTicket(id, tenantId) {
    const ticket = await ticketsRepository.restoreTicket(id, tenantId);
    if (!ticket) throw new AppError(404, 'Ticket not found or not deleted');
    return ticket;
  },
};
