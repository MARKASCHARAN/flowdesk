import { Worker } from 'bullmq';
import { redis } from '../infra/cache/redis.js';
import logger from '../infra/logger/index.js';
import crypto from 'crypto';
import fetch from 'node-fetch';

/**
 * Webhook Worker
 * 
 * Industry standard: Outgoing webhooks should NEVER block the main thread.
 * They are queued with retries, exponential backoff, and signed using HMAC
 * SHA-256 so the receiving server can verify the payload originated from us.
 */
export const startWebhookWorker = () => {
  const worker = new Worker(
    'webhook-queue',
    async (job) => {
      const { url, payload, secret, eventType, tenantId } = job.data;
      
      // Generate signature
      const timestamp = Date.now().toString();
      const signaturePayload = `${timestamp}.${JSON.stringify(payload)}`;
      const signature = crypto
        .createHmac('sha256', secret)
        .update(signaturePayload)
        .digest('hex');

      logger.info(`[Webhook] Sending ${eventType} to ${url} (Tenant: ${tenantId})`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FlowDesk-Webhook/1.0',
          'X-FlowDesk-Signature': `t=${timestamp},v1=${signature}`,
          'X-FlowDesk-Event': eventType,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      logger.info(`[Webhook] Success: ${eventType} to ${url}`);
      return { success: true, status: response.status };
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on('failed', (job, err) => {
    logger.error(`[Webhook] Job ${job.id} failed: ${err.message}`);
  });

  return worker;
};
