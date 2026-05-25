import { commentsService } from '../services/comments.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const commentsController = {
  async createComment(req, res, next) {
    try {
      // For creating a comment, the user might be an admin/agent or a customer themselves.
      // But we will derive the userId directly from the authenticated token
      const comment = await commentsService.createComment(
        res.locals.tenantId,
        req.params.ticketId,
        req.user.id,
        req.body
      );
      sendResponse(res, 201, comment, 'Comment added successfully');
    } catch (error) {
      next(error);
    }
  },

  async getComments(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      // If user is just a 'Customer' role, we might want to override `includeInternal` to false.
      // Assuming req.user.roles includes 'Admin' or 'Agent' if they are internal staff.
      const isStaff = req.user.roles && (req.user.roles.includes('Admin') || req.user.roles.includes('Agent') || req.user.roles.includes('Manager'));
      
      let includeInternal = req.query.includeInternal !== 'false';
      if (!isStaff) {
        includeInternal = false; // Force false for external users
      }

      const { comments, total } = await commentsService.getCommentsForTicket(res.locals.tenantId, req.params.ticketId, {
        skip,
        take: limit,
        includeInternal
      });

      sendResponse(res, 200, {
        comments,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req, res, next) {
    try {
      const comment = await commentsService.updateComment(
        req.params.id,
        res.locals.tenantId,
        req.user.id,
        req.body
      );
      sendResponse(res, 200, comment, 'Comment updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req, res, next) {
    try {
      await commentsService.deleteComment(
        req.params.id,
        res.locals.tenantId,
        req.user.id
      );
      sendResponse(res, 200, null, 'Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};
