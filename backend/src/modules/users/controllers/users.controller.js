import { usersService } from '../services/users.service.js';
import { sendResponse } from '../../../infra/utils/response.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const usersController = {
  async getProfile(req, res, next) {
    try {
      const user = await usersService.getProfile(req.user.id, res.locals.tenantId);
      sendResponse(res, 200, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await usersService.updateProfile(req.user.id, res.locals.tenantId, req.body);
      sendResponse(res, 200, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError(400, 'No image file provided');
      }

      const user = await usersService.uploadAvatar(req.user.id, res.locals.tenantId, req.file);
      sendResponse(res, 200, user, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params; // Target user ID
      const { status } = req.body;
      const user = await usersService.updateStatus(id, res.locals.tenantId, status);
      sendResponse(res, 200, user, `User status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  },

  async getTeamMembers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      
      const skip = (page - 1) * limit;
      
      const { users, total } = await usersService.getTeamMembers(res.locals.tenantId, { skip, take: limit, search });
      
      sendResponse(res, 200, {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, 'Team members retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};
