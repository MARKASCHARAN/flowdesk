import { commentsRepository } from '../repositories/comments.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { prisma } from '../../../infra/db/prisma.js';
import { getSocketServer } from '../../../infra/websocket/socket.js';

export const commentsService = {
  async createComment(tenantId, ticketId, userId, data) {
    // Verify the ticket exists and belongs to the tenant
    const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, tenantId, deletedAt: null } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    if (data.parentCommentId) {
      const parent = await prisma.comment.findFirst({ where: { id: data.parentCommentId, tenantId, ticketId } });
      if (!parent) throw new AppError(404, 'Parent comment not found');
    }

    const newComment = await commentsRepository.createComment(tenantId, ticketId, userId, data);

    // Broadcast the new comment to everyone viewing this ticket
    const io = getSocketServer();
    io.to(`ticket_${ticketId}`).emit('comment:new', newComment);

    return newComment;
  },

  async getCommentsForTicket(tenantId, ticketId, options) {
    // Verify ticket exists
    const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, tenantId, deletedAt: null } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    return commentsRepository.findCommentsByTicket(tenantId, ticketId, options);
  },

  async updateComment(id, tenantId, userId, data) {
    const comment = await commentsRepository.updateComment(id, tenantId, userId, data);
    if (!comment) {
      throw new AppError(403, 'Comment not found or you do not have permission to edit it');
    }
    return comment;
  },

  async deleteComment(id, tenantId, userId) {
    const comment = await commentsRepository.deleteComment(id, tenantId, userId);
    if (!comment) {
      throw new AppError(403, 'Comment not found or you do not have permission to delete it');
    }
  }
};
