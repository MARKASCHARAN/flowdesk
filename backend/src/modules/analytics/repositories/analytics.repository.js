import { prisma } from '../../../infra/db/prisma.js';

export const analyticsRepository = {
  async countTickets(tenantId) {
    return prisma.ticket.count({ where: { tenantId } });
  },

  async countTicketsByStatus(tenantId, status) {
    return prisma.ticket.count({ where: { tenantId, status } });
  },

  async countCustomers(tenantId) {
    return prisma.customer.count({ where: { tenantId } });
  },

  async getTicketTrends(tenantId) {
    // In PostgreSQL, date_trunc can group by day. For Prisma, a common approach 
    // is using groupBy on createdAt, but since Prisma's groupBy doesn't fully support 
    // date_trunc easily across all DBs without raw queries, we use a raw query or fetch recent.
    
    // For this boilerplate, we'll return a simple raw query aggregate
    const result = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
      FROM "tickets"
      WHERE "tenant_id" = ${tenantId}::uuid AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC;
    `;

    return result.map(row => ({
      date: row.date,
      // BigInt from postgres count needs to be cast to Number
      count: Number(row.count)
    }));
  }
};
