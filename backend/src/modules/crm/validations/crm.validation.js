import joi from 'joi';

export const crmValidation = {
  createCustomer: {
    body: joi.object().keys({
      name: joi.string().required(),
      email: joi.string().email().allow('', null),
      phone: joi.string().allow('', null),
      company: joi.string().allow('', null),
      tags: joi.array().items(joi.string()).allow(null),
    }),
  },
  updateCustomer: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi
      .object()
      .keys({
        name: joi.string(),
        email: joi.string().email().allow('', null),
        phone: joi.string().allow('', null),
        company: joi.string().allow('', null),
        tags: joi.array().items(joi.string()).allow(null),
        status: joi.string().valid('active', 'inactive', 'archived'),
      })
      .min(1),
  },
  createLead: {
    params: joi.object().keys({
      customerId: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      source: joi.string().allow('', null),
      stage: joi.string().required(),
      assignedTo: joi.string().uuid().allow(null),
      priority: joi.string().valid('low', 'medium', 'high').allow(null),
    }),
  },
  updateLead: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi
      .object()
      .keys({
        stage: joi.string(),
        assignedTo: joi.string().uuid().allow(null),
        priority: joi.string().valid('low', 'medium', 'high').allow(null),
      })
      .min(1),
  },
  addNote: {
    params: joi.object().keys({
      customerId: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      body: joi.string().required(),
    }),
  },
  listQuery: {
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(10),
      search: joi.string().allow(''),
      stage: joi.string().allow(''),
    }),
  },
  paramId: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  },
};
