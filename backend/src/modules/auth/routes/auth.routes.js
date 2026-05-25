import { Router } from 'express';
import passport from 'passport';
import '../strategies/google.strategy.js';
import { authController } from '../controllers/auth.controller.js';
import { authValidation } from '../validations/auth.validation.js';
import { validate } from '../../../api/middlewares/validate.js';
import { requireAuth } from '../../../api/middlewares/auth.js';
import { authLimiter } from '../../../api/middlewares/rateLimiter.js';
import { authRepository } from '../repositories/auth.repository.js';
import { generateTokens } from '../services/auth.service.js';

const router = Router();

// Public routes
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/refresh', validate(authValidation.refreshToken), authController.refresh);
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.post('/logout-all', requireAuth, authController.logoutAll);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user);

    await authRepository.createSession(
      req.user.id,
      refreshToken,
      req.ip,
      req.headers['user-agent']
    );

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (error) {
    next(error);
  }
});

export default router;
