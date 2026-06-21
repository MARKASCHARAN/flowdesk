import { prisma } from '../../../infra/db/prisma.js';

export const billingRepository = {
  async getSubscriptionByTenantId(tenantId) {
    return prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        invoices: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
  },

  async createSubscription(data) {
    return prisma.subscription.create({ data });
  },

  async updateSubscription(id, data) {
    return prisma.subscription.update({
      where: { id },
      data,
    });
  },

  async getSubscriptionByProviderRef(providerRef) {
    // In our schema we don't have providerRef on subscription,
    // but typically we'd use stripeSubscriptionId.
    // For now we assume we might query by some JSON metadata if needed.
    // Let's assume we map tenantId directly to Stripe Customer ID via tenant metadata or plan.
    // Actually, we can use the Subscription ID itself in Stripe's metadata.
    return null; // Implemented based on actual need
  },

  async createPayment(data) {
    return prisma.payment.create({ data });
  },

  async updateTenantPlan(tenantId, planName) {
    return prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: planName },
    });
  },
};
