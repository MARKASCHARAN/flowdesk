import { prisma } from '../../../infra/db/prisma.js';

export const commentsRepository = {
  async createComment(tenantId, ticketId, userId, data) {
    return prisma.comment.create({
      data: {
        tenantId,
        ticketId,
        userId,
        ...data,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
  },

  async findCommentsByTicket(tenantId, ticketId, options = {}) {
    const { skip = 0, take = 50, includeInternal = true } = options;
    const where = {
      tenantId,
      ticketId,
      deletedAt: null,
      parentCommentId: null, // Only fetch top-level comments; replies are fetched via include
      ...(!includeInternal && { isInternal: false }),
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'asc' }, // Oldest first for threads
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          replies: {
            where: { deletedAt: null },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  },

  async updateComment(id, tenantId, userId, data) {
    // Users can only update their own comments
    const comment = await prisma.comment.findFirst({ where: { id, tenantId, userId, deletedAt: null } });
    if (!comment) return null;
    
    return prisma.comment.update({ 
      where: { id }, 
      data,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
  },

  async deleteComment(id, tenantId, userId) {
    // Users can only delete their own comments
    const comment = await prisma.comment.findFirst({ where: { id, tenantId, userId, deletedAt: null } });
    if (!comment) return null;
    
    return prisma.comment.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }
};
