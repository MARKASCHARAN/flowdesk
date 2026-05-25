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

const app = express();

/**
 * ------------------------------------------------------------------------
 * 1. Global Security & CORS
 * ------------------------------------------------------------------------
 * Industry standard: Security headers and CORS must be the very first 
 * middlewares loaded to protect all downstream routes.
 */
app.use(helmet());
app.use(cors({
  origin: config.env === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true,
}));

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

/**
 * ------------------------------------------------------------------------
 * 4. Body Parsers
 * ------------------------------------------------------------------------
 * Industry standard: Parse incoming JSON payloads and URL-encoded data.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
 * 6. API Routes Mounting
 * ------------------------------------------------------------------------
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);

/**
 * ------------------------------------------------------------------------
 * 7. Catch-All 404 Handler
 * ------------------------------------------------------------------------
 * Industry standard: If a request makes it past all routes without being 
 * resolved, we explicitly catch it and pass a 404 AppError to the global handler.
 */
app.all('*', (req, res, next) => {
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
