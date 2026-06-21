import { attachmentsRepository } from '../repositories/attachments.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { prisma } from '../../../infra/db/prisma.js';
import { generatePresignedUrl } from '../../../infra/storage/s3.js';
import crypto from 'crypto';
import path from 'path';

export const attachmentsService = {
  async generatePresignedUrl(
    tenantId,
    ticketId,
    userId,
    fileName,
    mimeType,
    fileSize
  ) {
    // 1. Verify Ticket exists
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, tenantId, deletedAt: null },
    });
    if (!ticket) {
      throw new AppError(404, 'Ticket not found');
    }

    // 2. Generate destination key with strict tenant isolation path
    const ext = path.extname(fileName);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const destinationKey = `attachments/${tenantId}/${ticketId}/${uniqueId}${ext}`;

    // 3. Generate presigned URL
    const { uploadUrl, fileUrl } = await generatePresignedUrl(
      destinationKey,
      mimeType
    );

    // 4. Save placeholder/record to DB
    const data = {
      fileName,
      fileSize,
      mimeType,
      fileUrl,
    };
    const attachment = await attachmentsRepository.createAttachment(
      tenantId,
      ticketId,
      userId,
      data
    );

    return { uploadUrl, attachment };
  },

  async getAttachmentsForTicket(tenantId, ticketId) {
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, tenantId, deletedAt: null },
    });
    if (!ticket) throw new AppError(404, 'Ticket not found');

    return attachmentsRepository.findAttachmentsByTicket(tenantId, ticketId);
  },

  async deleteAttachment(id, tenantId, userId, userRoles) {
    const attachment = await attachmentsRepository.findAttachmentById(
      id,
      tenantId
    );
    if (!attachment) throw new AppError(404, 'Attachment not found');

    // Security: Only the original uploader or an Admin/Agent can delete an attachment
    const isUploader = attachment.uploadedBy === userId;
    const isStaff = userRoles.includes('Admin') || userRoles.includes('Agent');

    if (!isUploader && !isStaff) {
      throw new AppError(
        403,
        'You do not have permission to delete this attachment'
      );
    }

    return attachmentsRepository.deleteAttachment(id, tenantId);
  },
};
