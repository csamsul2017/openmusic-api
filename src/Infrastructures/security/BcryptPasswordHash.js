const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return await this._bcrypt.hash(password, this._saltRound);
  }

  async compare(plainPassword, encryptedPassword) {
    const result = await this._bcrypt.compare(plainPassword, encryptedPassword);
    if (!result) {
      throw new AuthenticationError('Password incorrectly');
    }
    return result;
  }
}

module.exports = BcryptPasswordHash;
