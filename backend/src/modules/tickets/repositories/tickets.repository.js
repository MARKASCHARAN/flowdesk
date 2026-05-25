import { prisma } from '../../../infra/db/prisma.js';

export const ticketsRepository = {
  async createTicket(tenantId, createdBy, data) {
    return prisma.ticket.create({
      data: {
        tenantId,
        createdBy,
        ...data,
      },
    });
  },

  async findTickets(tenantId, options = {}) {
    const { take = 10, cursor, status, priority, assigneeId, customerId, search } = options;
    const where = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assigneeId && { assigneeId }),
      ...(customerId && { customerId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const query = {
      where,
      take: take + 1, // Fetch one extra to check if there is a next page
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, company: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
        _count: { select: { comments: true, attachments: true } }
      }
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1; // Skip the cursor itself
    }

    const [ticketsRaw, total] = await Promise.all([
      prisma.ticket.findMany(query),
      prisma.ticket.count({ where }),
    ]);

    let nextCursor = null;
    if (ticketsRaw.length > take) {
      const nextItem = ticketsRaw.pop();
      nextCursor = ticketsRaw[ticketsRaw.length - 1].id; // Set cursor to the last valid item
    } else if (ticketsRaw.length > 0) {
      nextCursor = null; // No more items
    }

    return { tickets: ticketsRaw, nextCursor, total };
  },

  async findTicketById(id, tenantId) {
    return prisma.ticket.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        customer: { select: { id: true, name: true, email: true, company: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        creator: { select: { id: true, name: true } },
        comments: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        },
        attachments: true,
      }
    });
  },

  async updateTicket(id, tenantId, data) {
    const ticket = await prisma.ticket.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!ticket) return null;
    return prisma.ticket.update({
      where: { id },
      data,
      include: {
        assignee: { select: { name: true, avatarUrl: true } }
      }
    });
  },

  async deleteTicket(id, tenantId) {
    const ticket = await prisma.ticket.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!ticket) return null;
    return prisma.ticket.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async restoreTicket(id, tenantId) {
    const ticket = await prisma.ticket.findFirst({ where: { id, tenantId, deletedAt: { not: null } } });
    if (!ticket) return null;
    return prisma.ticket.update({ where: { id }, data: { deletedAt: null } });
  }
};
