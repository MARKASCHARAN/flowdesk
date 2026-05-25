import joi from 'joi';

export const attachmentsValidation = {
  paramTicketId: {
    params: joi.object().keys({
      ticketId: joi.string().uuid().required(),
    }),
  },
  paramId: {
    params: joi.object().keys({
      id: joi.string().uuid().required(),
    }),
  }
};
