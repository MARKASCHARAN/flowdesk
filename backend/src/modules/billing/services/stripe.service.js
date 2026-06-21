import Stripe from 'stripe';
import { config } from '../../../infra/config/env.js';
import { AppError } from '../../../infra/errors/AppError.js';
import logger from '../../../infra/logger/index.js';

// We fallback to a mock client if there's no STRIPE_SECRET_KEY, useful for testing environments
const isMock = !config.stripe || !config.stripe.secretKey;
const stripe = isMock
  ? null
  : new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-04-10',
    });

if (isMock) {
  logger.warn(
    'STRIPE_SECRET_KEY is missing. Stripe service is running in mock mode.'
  );
}

export const stripeService = {
  async createCustomer(email, name, metadata) {
    if (isMock) return { id: `cus_mock_${Date.now()}` };
    try {
      return await stripe.customers.create({ email, name, metadata });
    } catch (error) {
      logger.error(error, 'Stripe customer creation failed');
      throw new AppError(500, 'Payment provider error');
    }
  },

  async createCheckoutSession(
    customerId,
    priceId,
    successUrl,
    cancelUrl,
    clientReferenceId
  ) {
    if (isMock)
      return {
        id: `cs_mock_${Date.now()}`,
        url: `${successUrl}?session_id=mock`,
      };
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: clientReferenceId,
      });
      return session;
    } catch (error) {
      logger.error(error, 'Stripe checkout session creation failed');
      throw new AppError(500, 'Payment provider error');
    }
  },

  async createCustomerPortalSession(customerId, returnUrl) {
    if (isMock) return { url: returnUrl };
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      logger.error(error, 'Stripe billing portal session creation failed');
      throw new AppError(500, 'Payment provider error');
    }
  },

  verifyWebhookSignature(rawBody, signature, secret) {
    if (isMock) {
      // Mock validation
      try {
        const event = JSON.parse(rawBody.toString());
        if (!event || !event.type) throw new Error('Missing event type');
        return event;
      } catch (e) {
        throw new Error('Invalid mock payload: ' + e.message);
      }
    }

    try {
      return stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (error) {
      throw new AppError(400, `Webhook Error: ${error.message}`);
    }
  },
};
