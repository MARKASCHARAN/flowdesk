import { authService } from '../services/auth.service.js';
import { authRepository } from '../repositories/auth.repository.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);

      // Save session
      await authRepository.createSession(
        user.id,
        refreshToken,
        req.ip,
        req.headers['user-agent']
      );

      // Omit password hash from response
      delete user.passwordHash;

      sendResponse(res, 201, { user, accessToken, refreshToken }, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);

      // Save session
      await authRepository.createSession(
        user.id,
        refreshToken,
        req.ip,
        req.headers['user-agent']
      );

      delete user.passwordHash;

      sendResponse(res, 200, { user, accessToken, refreshToken }, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      await authRepository.createSession(
        result.user.id,
        result.refreshToken,
        req.ip,
        req.headers['user-agent']
      );

      delete result.user.passwordHash;

      sendResponse(res, 200, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body; // Client should provide the refresh token to invalidate
      await authService.logout(refreshToken);
      sendResponse(res, 200, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  },

  async logoutAll(req, res, next) {
    try {
      await authService.logoutAll(req.user.id);
      sendResponse(res, 200, null, 'Logged out from all devices');
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      await authService.forgotPassword(req.body);
      // We always send a success response to prevent email enumeration attacks
      sendResponse(res, 200, null, 'If that email exists, a reset link has been sent');
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);
      sendResponse(res, 200, null, 'Password has been reset successfully');
    } catch (error) {
      next(error);
    }
  },
};
