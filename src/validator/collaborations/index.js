const InvariantError = require('../../exceptions/InvariantError');
const CollaboratorPayloadSchema = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = CollaboratorPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
