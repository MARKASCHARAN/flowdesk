import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authRepository } from '../repositories/auth.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { config } from '../../../infra/config/env.js';
import {
  setCache,
  getCache,
  deleteCache,
} from '../../../infra/cache/helpers.js';
import { defaultQueue } from '../../../infra/queue/bullmq.js';

export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    roles: user.memberships ? user.memberships.map((m) => m.role.name) : [],
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn, // e.g., '1h'
  });

  const refreshToken = jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
    config.jwt.secret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const authService = {
  async register({ email, password, name, companyName }) {
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepository.signup({
      email,
      passwordHash,
      name,
      companyName,
    });

    // We fetch user again to get the included tenant/memberships
    const fullUser = await authRepository.findUserById(user.id);
    const { accessToken, refreshToken } = generateTokens(fullUser);

    return { user: fullUser, accessToken, refreshToken };
  },

  async login({ email, password }) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user);
    return { user, accessToken, refreshToken };
  },

  async refreshToken(token) {
    if (!token) {
      throw new AppError(401, 'Refresh token is required');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const session = await authRepository.findSessionByToken(token);

      if (!session || session.expiresAt < new Date()) {
        throw new AppError(401, 'Invalid or expired refresh token');
      }

      const user = await authRepository.findUserById(decoded.id);
      if (!user) {
        throw new AppError(401, 'User no longer exists');
      }

      const tokens = generateTokens(user);

      // Delete old session, create new
      await authRepository.deleteSession(token);
      return { user, ...tokens };
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token');
    }
  },

  async logout(refreshToken) {
    if (refreshToken) {
      await authRepository.deleteSession(refreshToken);
    }
  },

  async logoutAll(userId) {
    await authRepository.deleteUserSessions(userId);
  },

  async forgotPassword({ email }) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) return; // Silent fail for security

    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store in Redis for 1 hour (3600 seconds)
    await setCache(`pwd_reset:${resetToken}`, user.id, 3600);

    // Enqueue email job
    await defaultQueue.add('send-email', {
      to: email,
      subject: 'Password Reset Instructions',
      body: `Your reset link: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
    });
  },

  async resetPassword({ token, newPassword }) {
    const userId = await getCache(`pwd_reset:${token}`);
    if (!userId) {
      throw new AppError(400, 'Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await authRepository.updateUserPassword(userId, passwordHash);

    // Clean up
    await deleteCache(`pwd_reset:${token}`);
    await authRepository.deleteUserSessions(userId); // Force re-login
  },
};
