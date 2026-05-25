import { AppError } from '../../infra/errors/AppError.js';
import logger from '../../infra/logger/index.js';
import { config } from '../../infra/config/env.js';

/**
 * Global Error Handler Middleware
 * 
 * Industry standard: This intercepts all errors thrown in the application.
 * It normalizes native Error objects into AppError instances, builds a safe response
 * payload (stripping stack traces in production to prevent data leaks), and logs 
 * the error context automatically.
 * 
 * @param {Error} err - The error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert generic Node.js or Prisma errors into predictable AppErrors
  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.locals.errorMessage = error.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(error);
  } else if (!error.isOperational) {
    // In production, mask the message of unknown internal server errors 
    // to avoid leaking database schemas or internal directory structures.
    response.message = 'Internal Server Error';
    logger.error(error);
  }

  res.status(statusCode).json(response);
};
