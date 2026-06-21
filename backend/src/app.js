// Force nodemon restart
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { httpLogger } from './infra/logger/index.js';
import { apiLimiter } from './api/middlewares/rateLimiter.js';
import { errorHandler } from './api/middlewares/errorHandler.js';
import { AppError } from './infra/errors/AppError.js';
import { config } from './infra/config/env.js';
import { authRoutes } from './modules/auth/index.js';
import { usersRoutes } from './modules/users/index.js';
import { tenantsRoutes } from './modules/tenants/index.js';
import { rbacRoutes } from './modules/rbac/index.js';
import { crmRoutes } from './modules/crm/index.js';
import { ticketsRoutes } from './modules/tickets/index.js';
import { commentsRoutes } from './modules/comments/index.js';
import { notificationsRoutes } from './modules/notifications/index.js';
import { attachmentsRoutes } from './modules/attachments/index.js';
import { searchRoutes } from './modules/search/index.js';
import { auditLogsRoutes } from './modules/audit-logs/index.js';

const app = express();

/**
 * ------------------------------------------------------------------------
 * 1. Global Security & CORS
 * ------------------------------------------------------------------------
 * Industry standard: Security headers and CORS must be the very first
 * middlewares loaded to protect all downstream routes.
 */
app.use(helmet());
app.use(
  cors({
    origin: config.env === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true,
  })
);

/**
 * ------------------------------------------------------------------------
 * 2. Rate Limiting
 * ------------------------------------------------------------------------
 * Industry standard: Protect APIs from brute-force and DDoS attacks before
 * hitting business logic or DB.
 */
app.use('/api', apiLimiter);

/**
 * ------------------------------------------------------------------------
 * 3. Observability & Logging
 * ------------------------------------------------------------------------
 * Industry standard: Log the request immediately after it passes basic security
 * checks, ensuring we capture high-quality metrics and debug traces.
 */
app.use(httpLogger);

import promBundle from 'express-prom-bundle';
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});
app.use(metricsMiddleware);

/**
 * ------------------------------------------------------------------------
 * 4. Stripe Webhook (Must precede express.json)
 * ------------------------------------------------------------------------
 * Industry standard: Stripe requires the raw, unparsed request body to verify the signature.
 */
import { billingController } from './modules/billing/controllers/billing.controller.js';
app.post(
  '/api/v1/billing/webhook',
  express.raw({ type: 'application/json' }),
  billingController.webhook
);

/**
 * ------------------------------------------------------------------------
 * 5. Body Parsers
 * ------------------------------------------------------------------------
 * Industry standard: Parse incoming JSON payloads and URL-encoded data.
 */
import { contextMiddleware } from './api/middlewares/context.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(contextMiddleware); // Initialize AsyncLocalStorage context

/**
 * ------------------------------------------------------------------------
 * 5. Healthcheck Route
 * ------------------------------------------------------------------------
 * Industry standard: An unauthenticated endpoint for Kubernetes, AWS ELB,
 * or Docker health checks to ping to verify the server is alive.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

/**
 * ------------------------------------------------------------------------
 * 7. API Routes Mounting
 * ------------------------------------------------------------------------
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/tenants', tenantsRoutes);
app.use('/api/v1/rbac', rbacRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/tickets', ticketsRoutes);
app.use('/api/v1/comments', commentsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/attachments', attachmentsRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/audit-logs', auditLogsRoutes);
import { billingRoutes } from './modules/billing/index.js';
app.use('/api/v1/billing', billingRoutes);

import { analyticsRoutes } from './modules/analytics/index.js';
app.use('/api/v1/analytics', analyticsRoutes);

import { reportingRoutes } from './modules/reporting/index.js';
app.use('/api/v1/reports', reportingRoutes);

import { adminRoutes } from './modules/admin/index.js';
app.use('/api/v1/admin', adminRoutes);

/**
 * ------------------------------------------------------------------------
 * 7. Catch-All 404 Handler
 * ------------------------------------------------------------------------
 * Industry standard: If a request makes it past all routes without being
 * resolved, we explicitly catch it and pass a 404 AppError to the global handler.
 */
app.use((req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

/**
 * ------------------------------------------------------------------------
 * 8. Global Error Handler
 * ------------------------------------------------------------------------
 * Industry standard: Must be the absolute last middleware.
 * Catches all `next(err)` calls and formats a standardized JSON error response.
 */
app.use(errorHandler);

export default app;
