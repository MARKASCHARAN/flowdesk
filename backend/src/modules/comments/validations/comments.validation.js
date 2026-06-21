import joi from 'joi';

export const commentsValidation = {
  createComment: {
    params: joi.object().keys({
      ticketId: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      body: joi.string().required(),
      parentCommentId: joi.string().uuid().allow(null),
      isInternal: joi.boolean().default(false),
    }),
  },
  updateComment: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      body: joi.string().required(),
    }),
  },
  listQuery: {
    params: joi.object().keys({
      ticketId: joi.string().uuid().required(),
    }),
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(50),
      includeInternal: joi.boolean().default(true), // Depending on the user's role this might be overwritten
    }),
  },
  paramId: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  },
};
