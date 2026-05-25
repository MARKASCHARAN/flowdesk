import { prisma } from '../../../infra/db/prisma.js';

export const crmRepository = {
  // --- Customers ---
  async createCustomer(tenantId, data) {
    return prisma.customer.create({
      data: { tenantId, ...data },
    });
  },

  async findCustomers(tenantId, options = {}) {
    const { skip = 0, take = 10, search } = options;
    const where = {
      tenantId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { leads: true, tickets: true } },
        }
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  },

  async findCustomerById(id, tenantId) {
    return prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        leads: { include: { assignee: { select: { name: true } } } },
        notes: { include: { creator: { select: { name: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' } },
      }
    });
  },

  async updateCustomer(id, tenantId, data) {
    const customer = await prisma.customer.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!customer) return null;
    return prisma.customer.update({ where: { id }, data });
  },

  async deleteCustomer(id, tenantId) {
    const customer = await prisma.customer.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!customer) return null;
    return prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // --- Leads ---
  async createLead(tenantId, data) {
    return prisma.lead.create({
      data: { tenantId, ...data },
      include: { customer: true },
    });
  },

  async updateLead(id, tenantId, data) {
    const lead = await prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) return null;
    return prisma.lead.update({ where: { id }, data });
  },

  async findLeads(tenantId, options = {}) {
    const { skip = 0, take = 10, stage } = options;
    const where = { tenantId, ...(stage && { stage }) };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, company: true } },
          assignee: { select: { name: true } },
        }
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
  },

  // --- Notes ---
  async createNote(tenantId, customerId, createdBy, body) {
    return prisma.note.create({
      data: {
        tenantId,
        customerId,
        createdBy,
        body
      },
      include: {
        creator: { select: { name: true, avatarUrl: true } }
      }
    });
  }
};
