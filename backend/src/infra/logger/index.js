import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { config } from '../config/env.js';

const logger = pino({
  level: config.logger.level,
  transport:
    config.env === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

import crypto from 'crypto';

export const httpLogger = pinoHttp({
  logger,
  genReqId: function (req) {
    return req.headers['x-request-id'] || crypto.randomUUID();
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export default logger;
