import joi from 'joi';

export const tenantsValidation = {
  updateTenant: {
    body: joi.object().keys({
      name: joi.string(),
      slug: joi.string().regex(/^[a-z0-9-]+$/).message('Slug can only contain lowercase letters, numbers, and hyphens'),
      domain: joi.string().domain().allow('', null),
    }).min(1),
  },
};
