const Joi = require('@hapi/joi');

module.exports = {
  getMessages: {
    headers: Joi.object().keys({
      token: Joi.string().required()
    }).options({ allowUnknown: true }),
    query: Joi.object().keys({
      stream_id: Joi.string().required()
    }),
  }
};
