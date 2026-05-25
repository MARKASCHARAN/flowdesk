import joi from 'joi';

export const ticketsValidation = {
  createTicket: {
    body: joi.object().keys({
      customerId: joi.string().uuid().required(),
      title: joi.string().required(),
      description: joi.string().required(),
      priority: joi.string().valid('low', 'medium', 'high', 'critical').required(),
      category: joi.string().allow('', null),
      assigneeId: joi.string().uuid().allow(null),
    }),
  },
  updateTicket: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      title: joi.string(),
      description: joi.string(),
      priority: joi.string().valid('low', 'medium', 'high', 'critical'),
      status: joi.string().valid('open', 'in_progress', 'resolved', 'closed'),
      category: joi.string().allow('', null),
      assigneeId: joi.string().uuid().allow(null),
    }).min(1),
  },
  listQuery: {
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(10),
      search: joi.string().allow(''),
      status: joi.string().valid('open', 'in_progress', 'resolved', 'closed').allow(''),
      priority: joi.string().valid('low', 'medium', 'high', 'critical').allow(''),
      assigneeId: joi.string().uuid().allow(''),
      customerId: joi.string().uuid().allow(''),
    }),
  },
  paramId: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  }
};
