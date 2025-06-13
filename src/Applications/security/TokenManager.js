class TokenManager {
  async generateAccessToken(userId) {
    throw new Error('ACCESS_TOKEN.METHOD_NOT_IMPLEMENTED');
  }
  async generateRefreshToken(userId) {
    throw new Error('REFRESH_TOKEN.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = TokenManager;
