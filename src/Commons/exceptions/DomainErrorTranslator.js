const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'Cannot create new user because required property is missing',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'Do not create new user because data type not match',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'Cannot create new user because username characters exceed limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'Cannot create new user because username contains prohibited characters',
  ),
};

module.exports = DomainErrorTranslator;
