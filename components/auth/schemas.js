const Joi = require("@hapi/joi");

module.exports = {
  login: Joi.object()
    .keys({
      token: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
