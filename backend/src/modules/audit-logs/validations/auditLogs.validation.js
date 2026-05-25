import joi from 'joi';

export const auditLogsValidation = {
  listQuery: {
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(50),
      userId: joi.string().uuid(),
      action: joi.string(),
      resource: joi.string(),
    }),
  }
};
