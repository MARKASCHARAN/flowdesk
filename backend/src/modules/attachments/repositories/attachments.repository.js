import { prisma } from '../../../infra/db/prisma.js';

export const attachmentsRepository = {
  async createAttachment(tenantId, ticketId, uploadedBy, data) {
    return prisma.attachment.create({
      data: {
        tenantId,
        ticketId,
        uploadedBy,
        ...data,
      },
    });
  },

  async findAttachmentsByTicket(tenantId, ticketId) {
    return prisma.attachment.findMany({
      where: {
        tenantId,
        ticketId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findAttachmentById(id, tenantId) {
    return prisma.attachment.findFirst({
      where: { id, tenantId, deletedAt: null }
    });
  },

  async deleteAttachment(id, tenantId) {
    return prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
};
