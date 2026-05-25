import joi from 'joi';

export const attachmentsValidation = {
  presignedUrl: {
    params: joi.object().keys({
      ticketId: joi.string().uuid().required(),
    }),
    body: joi.object().keys({
      fileName: joi.string().required(),
      mimeType: joi.string().required(),
      fileSize: joi.number().integer().min(1).required(),
    }),
  },
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
