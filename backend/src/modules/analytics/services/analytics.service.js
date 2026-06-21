import { analyticsRepository } from '../repositories/analytics.repository.js';
import { redis } from '../../../infra/cache/redis.js';

export const analyticsService = {
  async getDashboardMetrics(tenantId) {
    const cacheKey = `analytics:dashboard:${tenantId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [totalTickets, openTickets, totalCustomers] = await Promise.all([
      analyticsRepository.countTickets(tenantId),
      analyticsRepository.countTicketsByStatus(tenantId, 'open'),
      analyticsRepository.countCustomers(tenantId),
    ]);

    const metrics = {
      totalTickets,
      openTickets,
      resolvedTickets: totalTickets - openTickets,
      totalCustomers,
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(metrics));
    return metrics;
  },

  async getTicketTrends(tenantId) {
    const cacheKey = `analytics:trends:${tenantId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const trends = await analyticsRepository.getTicketTrends(tenantId);

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(trends));
    return trends;
  },
};
