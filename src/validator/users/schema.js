const Joi = require('joi');

const PostUserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const PutUserPayloadSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string().min(6).pattern(/^\S+$/),
  fullname: Joi.string(),
});

module.exports = { PostUserPayloadSchema, PutUserPayloadSchema };
