import { billingService } from '../services/billing.service.js';
import { sendResponse } from '../../../infra/utils/response.js';
import logger from '../../../infra/logger/index.js';

export const billingController = {
  async getSubscription(req, res, next) {
    try {
      const details = await billingService.getSubscriptionDetails(
        res.locals.tenantId
      );
      sendResponse(res, 200, details, 'Subscription details retrieved');
    } catch (error) {
      next(error);
    }
  },

  async checkout(req, res, next) {
    try {
      const { priceId, frontendUrl } = req.body;
      const result = await billingService.createCheckout(
        res.locals.tenantId,
        req.user.id,
        priceId,
        frontendUrl || req.headers.origin || 'http://localhost:3000'
      );
      sendResponse(res, 200, result, 'Checkout session created');
    } catch (error) {
      next(error);
    }
  },

  async portal(req, res, next) {
    try {
      const { returnUrl } = req.body;
      const result = await billingService.createPortal(
        res.locals.tenantId,
        req.user.id,
        returnUrl || req.headers.origin || 'http://localhost:3000'
      );
      sendResponse(res, 200, result, 'Customer portal session created');
    } catch (error) {
      next(error);
    }
  },

  async webhook(req, res, next) {
    try {
      // Stripe requires the raw body and the stripe signature header
      const signature = req.headers['stripe-signature'];
      logger.debug(
        `Webhook Debug req.body: ${Buffer.isBuffer(req.body) ? 'Buffer' : typeof req.body}`
      );
      await billingService.handleStripeWebhook(req.body, signature);

      res.status(200).send({ received: true });
    } catch (error) {
      // Stripe expects a 400 on webhook signature failure
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },
};
