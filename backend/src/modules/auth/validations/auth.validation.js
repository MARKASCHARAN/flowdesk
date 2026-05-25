import joi from 'joi';

export const authValidation = {
  register: {
    body: joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      name: joi.string().required(),
      companyName: joi.string().required(),
    }),
  },
  login: {
    body: joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
    }),
  },
  refreshToken: {
    body: joi.object().keys({
      refreshToken: joi.string().required(),
    }),
  },
  forgotPassword: {
    body: joi.object().keys({
      email: joi.string().email().required(),
    }),
  },
  resetPassword: {
    body: joi.object().keys({
      token: joi.string().required(),
      newPassword: joi.string().min(8).required(),
    }),
  },
};
