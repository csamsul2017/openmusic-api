const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistPayloadSchema,
  SongIdPayloadSchema,
  DeleteSongIdPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongIdPayload: (payload) => {
    const validationResult = SongIdPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteSongIdPayload: (payload) => {
    const validationResult = DeleteSongIdPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
