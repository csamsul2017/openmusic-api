const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const SongIdPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongIdPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  SongIdPayloadSchema,
  DeleteSongIdPayloadSchema,
};
