import joi from 'joi';

export const notificationsValidation = {
  listQuery: {
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(50),
      isRead: joi.boolean(),
    }),
  },
  paramId: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  },
};
