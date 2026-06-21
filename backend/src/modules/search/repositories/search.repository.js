import { prisma } from '../../../infra/db/prisma.js';

export const searchRepository = {
  async searchGlobal(tenantId, query, skip, take) {
    // Perform a naive parallel search across Customers, Leads, and Tickets
    // In production, you'd use Elasticsearch, MeiliSearch, or Postgres Full Text Search

    const [customers, tickets] = await Promise.all([
      prisma.customer.findMany({
        where: {
          tenantId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
          ],
        },
        take,
        select: { id: true, name: true, email: true, company: true },
      }),
      prisma.ticket.findMany({
        where: {
          tenantId,
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take,
        select: { id: true, title: true, status: true, priority: true },
      }),
    ]);

    return { customers, tickets };
  },
};
