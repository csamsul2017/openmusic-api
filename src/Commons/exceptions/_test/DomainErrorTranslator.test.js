const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'Cannot create new user because required property is missing',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError('Do not create new user because data type not match'),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'Cannot create new user because username characters exceed limit',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'Cannot create new user because username contains prohibited characters',
      ),
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
