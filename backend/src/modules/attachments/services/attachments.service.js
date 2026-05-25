import { attachmentsRepository } from '../repositories/attachments.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { prisma } from '../../../infra/db/prisma.js';
import { uploadFileToS3 } from '../../../infra/storage/s3.js';
import crypto from 'crypto';
import path from 'path';

export const attachmentsService = {
  async uploadAttachment(tenantId, ticketId, userId, file) {
    // 1. Verify Ticket exists
    const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, tenantId, deletedAt: null } });
    if (!ticket) {
      throw new AppError(404, 'Ticket not found');
    }

    // 2. Upload to S3
    const ext = path.extname(file.originalname);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const destinationKey = `attachments/${tenantId}/${ticketId}/${uniqueId}${ext}`;
    
    const fileUrl = await uploadFileToS3(file, destinationKey);

    // 3. Save to DB
    const data = {
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileUrl,
    };

    return attachmentsRepository.createAttachment(tenantId, ticketId, userId, data);
  },

  async getAttachmentsForTicket(tenantId, ticketId) {
    const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, tenantId, deletedAt: null } });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    return attachmentsRepository.findAttachmentsByTicket(tenantId, ticketId);
  },

  async deleteAttachment(id, tenantId, userId, userRoles) {
    const attachment = await attachmentsRepository.findAttachmentById(id, tenantId);
    if (!attachment) throw new AppError(404, 'Attachment not found');

    // Security: Only the original uploader or an Admin/Agent can delete an attachment
    const isUploader = attachment.uploadedBy === userId;
    const isStaff = userRoles.includes('Admin') || userRoles.includes('Agent');
    
    if (!isUploader && !isStaff) {
      throw new AppError(403, 'You do not have permission to delete this attachment');
    }

    return attachmentsRepository.deleteAttachment(id, tenantId);
  }
};
