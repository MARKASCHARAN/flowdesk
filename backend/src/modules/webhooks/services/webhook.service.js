import { webhookQueue } from '../../../infra/queue/queues.js';
import { prisma } from '../../../infra/db/prisma.js';
import logger from '../../../infra/logger/index.js';

export const webhookService = {
  /**
   * Dispatch an outgoing webhook event to all subscribed endpoints for a tenant
   */
  async dispatchEvent(tenantId, eventType, payload) {
    try {
      // For demonstration, we assume Tenant settings holds their webhook URLs.
      // In a real database, we would query a `WebhookEndpoint` table.
      // E.g., const endpoints = await prisma.webhookEndpoint.findMany({ where: { tenantId } });

      // We will simulate finding a registered endpoint for the tenant
      const mockWebhookUrl =
        process.env.MOCK_WEBHOOK_URL || 'https://webhook.site/mock-endpoint';
      const mockWebhookSecret =
        process.env.MOCK_WEBHOOK_SECRET || 'whsec_mock123';

      logger.info(
        `[WebhookService] Queuing ${eventType} for Tenant: ${tenantId}`
      );

      await webhookQueue.add(
        'send-webhook',
        {
          tenantId,
          eventType,
          payload,
          url: mockWebhookUrl,
          secret: mockWebhookSecret,
        },
        {
          jobId: `${tenantId}-${eventType}-${Date.now()}`, // Prevents duplicate jobs in the same ms
        }
      );
    } catch (error) {
      logger.error(
        `[WebhookService] Error dispatching event: ${error.message}`
      );
    }
  },
};
