import * as Joi from 'joi';

export const initializeBlockchainSchema: Joi.ObjectSchema = Joi.object({
  initialAccountBalances: Joi.array().items(Joi.number().required()).required(),
  pendingTransactions: Joi.array()
    .items(Joi.array().items(Joi.number().required()).min(3).max(3).optional())
    .required(),
  blockSize: Joi.number().required(),
});
