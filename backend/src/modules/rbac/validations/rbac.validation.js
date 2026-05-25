import joi from 'joi';

export const rbacValidation = {
  createRole: {
    body: joi.object().keys({
      name: joi.string().required(),
      description: joi.string().allow('', null),
    }),
  },
  updateRole: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      name: joi.string(),
      description: joi.string().allow('', null),
    }).min(1),
  },
  roleIdParam: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  },
  assignRole: {
    body: joi.object().keys({
      userId: joi.string().uuid().required(),
      roleId: joi.string().uuid().required(),
    }),
  },
};
