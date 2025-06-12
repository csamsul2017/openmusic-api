class PasswordHash {
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async compare(plainPassword, hashedPassword) {
    throw new Error('PASSWORD_COMPARE.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHash;
