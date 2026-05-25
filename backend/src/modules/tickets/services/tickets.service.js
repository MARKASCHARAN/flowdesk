import { ticketsRepository } from '../repositories/tickets.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { uploadFileToS3 } from '../../../infra/storage/s3.js';
import crypto from 'crypto';
import path from 'path';

export const ticketsService = {
  async createTicket(tenantId, createdBy, data) {
    // Basic defaults
    const ticketData = {
      ...data,
      status: 'open', // Default status
    };
    return ticketsRepository.createTicket(tenantId, createdBy, ticketData);
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
    return ticket;
  },

  async deleteTicket(id, tenantId) {
    const ticket = await ticketsRepository.deleteTicket(id, tenantId);
    if (!ticket) throw new AppError(404, 'Ticket not found');
  }
};
