const TokenManager = require('../../Applications/security/TokenManager');

class JwtTokenManager extends TokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async generateAccessToken(userId, tokenKey) {
    return this._jwt.token.generate(userId, tokenKey);
  }

  generateRefreshToken(userId, tokenKey) {
    return this._jwt.token.generate(userId, tokenKey);
  }
}

module.exports = JwtTokenManager;
