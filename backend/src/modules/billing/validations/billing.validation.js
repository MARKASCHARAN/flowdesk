import joi from 'joi';

export const billingValidation = {
  checkout: {
    body: joi.object().keys({
      priceId: joi.string().required(),
      frontendUrl: joi.string().uri().optional(),
    }),
  },
  portal: {
    body: joi.object().keys({
      returnUrl: joi.string().uri().optional(),
    }),
  },
};
