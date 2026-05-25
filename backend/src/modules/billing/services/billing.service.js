import { billingRepository } from '../repositories/billing.repository.js';
import { stripeService } from './stripe.service.js';
import { config } from '../../../infra/config/env.js';
import { AppError } from '../../../infra/errors/AppError.js';
import { auditLogsService } from '../../audit-logs/services/auditLogs.service.js';

export const billingService = {
  async getSubscriptionDetails(tenantId) {
    let sub = await billingRepository.getSubscriptionByTenantId(tenantId);
    if (!sub) {
      // Return a default free plan
      return {
        tenantId,
        plan: 'free',
        status: 'active',
        seats: 1,
        payments: [],
        invoices: []
      };
    }
    return sub;
  },

  async createCheckout(tenantId, userId, priceId, frontendUrl) {
    // In a real app, you might map tenantId to a stored Stripe customer ID.
    // For this boilerplate, we'll create a customer on the fly or use a mock.
    const customer = await stripeService.createCustomer(`tenant_${tenantId}@flowdesk.app`, `Tenant ${tenantId}`, {
      tenantId
    });

    const successUrl = `${frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/billing/cancel`;

    const session = await stripeService.createCheckoutSession(
      customer.id,
      priceId,
      successUrl,
      cancelUrl,
      tenantId // client_reference_id
    );

    auditLogsService.logEvent(tenantId, userId, 'checkout.started', 'Subscription', session.id, { priceId }).catch(() => {});

    return { url: session.url };
  },

  async createPortal(tenantId, userId, returnUrl) {
    // Similarly, we would look up the Stripe Customer ID from the tenant.
    // Mocking here for now.
    const customerId = `cus_mock_tenant_${tenantId}`;
    const session = await stripeService.createCustomerPortalSession(customerId, returnUrl);
    
    auditLogsService.logEvent(tenantId, userId, 'portal.opened', 'Subscription', tenantId).catch(() => {});
    
    return { url: session.url };
  },

  async handleStripeWebhook(rawBody, signature) {
    const webhookSecret = config.stripe?.webhookSecret;
    if (!webhookSecret && !(!config.stripe || !config.stripe.secretKey)) {
      throw new AppError(500, 'Stripe webhook secret not configured');
    }

    const event = stripeService.verifyWebhookSignature(rawBody, signature, webhookSecret);
    console.log('WEBHOOK EVENT:', event);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const tenantId = session.client_reference_id;
        if (tenantId) {
          // Grant Premium access
          console.log('UPDATING TENANT PLAN FOR:', tenantId);
          const updated = await billingRepository.updateTenantPlan(tenantId, 'premium');
          console.log('UPDATED TENANT:', updated);
          
          await billingRepository.createSubscription({
            tenantId,
            plan: 'premium',
            status: 'active',
            startsAt: new Date(),
          });

          // Normally you'd log the payment here too
          auditLogsService.logEvent(tenantId, 'system', 'subscription.activated', 'Subscription', session.id).catch(() => {});
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        // Logic to track invoice payment
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        // Handle cancellation
        break;
      }
      default:
        // Ignore unhandled event types
        break;
    }

    return { received: true };
  }
};
