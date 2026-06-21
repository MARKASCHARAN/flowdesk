import app from './app.js';
import { config } from './infra/config/env.js';
import logger from './infra/logger/index.js';
import { startAllWorkers } from './jobs/index.js';

/**
 * Handle Uncaught Exceptions
 *
 * Industry standard: Always catch synchronous errors that were not handled
 * anywhere else in the application. It is crucial to exit the process (process.exit)
 * after logging the fatal error, because the Node.js process is left in an
 * undefined state which could lead to memory leaks or hanging connections.
 */
process.on('uncaughtException', (err) => {
  logger.fatal(err, 'UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

/**
 * Start the Express API Server
 *
 * We listen on the configured port and log the environment mode.
 */
const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.env} mode on port ${config.port}`);

  // Initialize Background Queue Workers
  startAllWorkers();
});

// Initialize WebSockets
import { initSocketServer } from './infra/websocket/socket.js';
initSocketServer(server);

/**
 * Handle Unhandled Rejections
 *
 * Industry standard: Catch asynchronous promise rejections that lack a .catch() block.
 * We gracefully close the HTTP server first to finish existing requests,
 * then exit the process with a failure code to allow a process manager (like PM2 or Docker) to restart it cleanly.
 */
process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Graceful Shutdown (SIGTERM)
 *
 * Industry standard: Listen for the termination signal sent by process managers
 * (like Docker, Kubernetes, or Heroku) during deployments or scaling.
 * Closing the server gracefully ensures we do not abruptly drop ongoing client requests.
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
