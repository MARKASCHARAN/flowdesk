import { prisma } from '../../../infra/db/prisma.js';

export const authRepository = {
  // Create user + tenant + membership + role in one transaction
  async signup({ email, passwordHash, name, companyName }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const slug =
        companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
        '-' +
        Date.now();
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          slug,
          plan: 'free',
        },
      });

      // 2. Create Admin Role
      const role = await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: 'Admin',
          description: 'Full access',
        },
      });

      // 3. Create User
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name,
          email,
          passwordHash,
        },
      });

      // 4. Create Membership
      await tx.membership.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          roleId: role.id,
        },
      });

      return user;
    });
  },

  async findUserByEmail(email) {
    return prisma.user.findFirst({
      where: { email },
      include: { tenant: true, memberships: { include: { role: true } } },
    });
  },

  async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { tenant: true, memberships: { include: { role: true } } },
    });
  },

  async createSession(
    userId,
    refreshToken,
    ipAddress,
    userAgent,
    expiresInDays = 7
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return prisma.session.create({
      data: {
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
  },

  async findSessionByToken(refreshToken) {
    return prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  },

  async deleteSession(refreshToken) {
    try {
      return await prisma.session.delete({
        where: { refreshToken },
      });
    } catch (error) {
      return null;
    }
  },

  async deleteUserSessions(userId) {
    return prisma.session.deleteMany({
      where: { userId },
    });
  },

  async updateUserPassword(userId, newPasswordHash) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  },
};
