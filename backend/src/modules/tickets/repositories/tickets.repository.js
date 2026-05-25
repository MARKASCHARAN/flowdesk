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
    const { skip = 0, take = 10, status, priority, assigneeId, customerId, search } = options;
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

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, company: true } },
          assignee: { select: { id: true, name: true, avatarUrl: true } },
          creator: { select: { id: true, name: true } },
          _count: { select: { comments: true, attachments: true } }
        }
      }),
      prisma.ticket.count({ where }),
    ]);

    return { tickets, total };
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
  }
};
