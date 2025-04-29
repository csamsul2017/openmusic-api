const Joi = require('joi');

const CollaboratorPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = CollaboratorPayloadSchema;
