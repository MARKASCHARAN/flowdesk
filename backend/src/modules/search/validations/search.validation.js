import joi from 'joi';

export const searchValidation = {
  globalSearch: {
    query: joi.object().keys({
      q: joi.string().min(2).required(),
      limit: joi.number().integer().min(1).max(50).default(10),
    }),
  }
};
