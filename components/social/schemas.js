const Joi = require("@hapi/joi");

module.exports = {
  setDataId: Joi.object().keys({
    user_id: Joi.number().required(),
    channel_id: Joi.string().required(),
  }),
};
