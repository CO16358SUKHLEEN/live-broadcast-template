const Joi = require("@hapi/joi");

module.exports = {
  createStream: Joi.object().keys({
    product_user_id: Joi.number().required(),
    product_token: Joi.string().required(),
    user_email: Joi.string().required(),
    user_name: Joi.string().required(),
    user_contact_number: Joi.string().allow("").optional(),
    user_image: Joi.string().allow("").optional(),
    user_thumbnail_image: Joi.string().allow("").optional(),
    type: Joi.string().valid("PUBLISH", "PLAY").required(),
    stream_id: Joi.string(),
  }),
};
