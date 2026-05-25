import { usersRepository } from '../repositories/users.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { config } from '../../../infra/config/env.js';
import { uploadFileToS3 } from '../../../infra/storage/s3.js';
import crypto from 'crypto';
import path from 'path';

export const usersService = {
  async getProfile(userId, tenantId) {
    const user = await usersRepository.findUserById(userId, tenantId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  },

  async updateProfile(userId, tenantId, updateData) {
    const updatedUser = await usersRepository.updateUserProfile(userId, tenantId, updateData);
    if (!updatedUser) {
      throw new AppError(404, 'User not found');
    }
    return updatedUser;
  },

  async uploadAvatar(userId, tenantId, file) {
    if (!file.mimetype.startsWith('image/')) {
      throw new AppError(400, 'File must be an image');
    }

    const ext = path.extname(file.originalname);
    const fileName = `avatars/${tenantId}/${userId}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    const avatarUrl = await uploadFileToS3(file, fileName);

    const updatedUser = await usersRepository.updateUserProfile(userId, tenantId, { avatarUrl });
    if (!updatedUser) throw new AppError(404, 'User not found');
    
    return updatedUser;
  },

  async updateStatus(targetUserId, tenantId, status) {
    const updatedUser = await usersRepository.updateUserProfile(targetUserId, tenantId, { status });
    if (!updatedUser) {
      throw new AppError(404, 'User not found');
    }
    return updatedUser;
  },

  async getTeamMembers(tenantId, options) {
    return usersRepository.findUsersByTenant(tenantId, options);
  }
};
