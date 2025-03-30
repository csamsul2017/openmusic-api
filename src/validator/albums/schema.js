const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().positive().required(),
});

module.exports = { AlbumsPayloadSchema };
