import { attachmentsService } from '../services/attachments.service.js';
import { sendResponse } from '../../../infra/utils/response.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const attachmentsController = {
  async getPresignedUrl(req, res, next) {
    try {
      const { fileName, mimeType, fileSize } = req.body;
      if (!fileName || !mimeType || !fileSize) {
        throw new AppError(
          400,
          'Missing fileName, mimeType, or fileSize in body'
        );
      }

      const result = await attachmentsService.generatePresignedUrl(
        res.locals.tenantId,
        req.params.ticketId,
        req.user.id,
        fileName,
        mimeType,
        fileSize
      );

      sendResponse(res, 201, result, 'Presigned URL generated successfully');
    } catch (error) {
      next(error);
    }
  },

  async getAttachments(req, res, next) {
    try {
      const attachments = await attachmentsService.getAttachmentsForTicket(
        res.locals.tenantId,
        req.params.ticketId
      );

      sendResponse(res, 200, attachments);
    } catch (error) {
      next(error);
    }
  },

  async deleteAttachment(req, res, next) {
    try {
      await attachmentsService.deleteAttachment(
        req.params.id,
        res.locals.tenantId,
        req.user.id,
        req.user.roles || []
      );
      sendResponse(res, 200, null, 'Attachment deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
