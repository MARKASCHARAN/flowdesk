import { attachmentsService } from '../services/attachments.service.js';
import { sendResponse } from '../../../infra/utils/response.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const attachmentsController = {
  async uploadAttachment(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError(400, 'No file provided');
      }

      const attachment = await attachmentsService.uploadAttachment(
        res.locals.tenantId,
        req.params.ticketId,
        req.user.id,
        req.file
      );
      
      sendResponse(res, 201, attachment, 'Attachment uploaded successfully');
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
  }
};
