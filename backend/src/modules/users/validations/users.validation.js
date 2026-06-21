import joi from 'joi';

export const usersValidation = {
  updateProfile: {
    body: joi
      .object()
      .keys({
        name: joi.string(),
        phone: joi.string().allow('', null),
      })
      .min(1),
  },
  updateStatus: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      status: joi.string().valid('active', 'inactive', 'suspended').required(),
    }),
  },
  getTeamMembers: {
    query: joi.object().keys({
      page: joi.number().integer().min(1).default(1),
      limit: joi.number().integer().min(1).max(100).default(10),
      search: joi.string().allow(''),
    }),
  },
};
