import jwt from 'jsonwebtoken';
import { AppError } from '../../infra/errors/AppError.js';
import { config } from '../../infra/config/env.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Unauthorized: Missing or invalid token'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // The payload of the token

    // Inject into AsyncLocalStorage for Prisma Extension Audit Logs
    import('./context.js').then(({ requestContext }) => {
      const store = requestContext.getStore();
      if (store) {
        store.set('userId', decoded.id);
        store.set('tenantId', decoded.tenantId);
      }
    });

    next();
  } catch (err) {
    return next(new AppError(401, 'Unauthorized: Token expired or invalid'));
  }
};
