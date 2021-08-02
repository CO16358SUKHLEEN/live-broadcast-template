const Joi = require('@hapi/joi');

module.exports = {
  streams: Joi.object().keys({
    stream_id: Joi.number().required()
  })
};
