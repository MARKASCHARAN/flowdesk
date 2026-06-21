import prismaPkg from '@prisma/client';
const { PrismaClient } = prismaPkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pgPkg from 'pg';
const { Pool } = pgPkg;
import { config } from '../../infra/config/env.js';
import logger from '../../infra/logger/index.js';

/**
 * PostgreSQL Connection Pool
 * 
 * Industry standard: We use the native `pg` Pool instead of Prisma's default
 * connection management. This allows for better connection pooling, lower latency,
 * and seamless integration with external load balancers (like PgBouncer).
 */
const pool = new Pool({ connectionString: config.db.url });
const adapter = new PrismaPg(pool);

/**
 * Prisma Database Client
 * 
 * Industry standard: We instantiate a single, globally available Prisma Client instance.
 * It is configured to emit events rather than logging directly to stdout, allowing us 
 * to pipe all database logs through our centralized Pino logger for observability.
 */
import { auditExtension } from './auditExtension.js';

const basePrisma = new PrismaClient({
  adapter,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

export const prisma = auditExtension(basePrisma);

basePrisma.$on('query', (e) => {
  if (config.env === 'development') {
    logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
  }
});

basePrisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

basePrisma.$on('info', (e) => {
  logger.info(`Prisma Info: ${e.message}`);
});

basePrisma.$on('warn', (e) => {
  logger.warn(`Prisma Warn: ${e.message}`);
});
