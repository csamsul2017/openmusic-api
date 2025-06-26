const TokenManager = require('../../Applications/security/TokenManager');
const Config = require('../../Commons/config');

class JwtTokenManager extends TokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  generateAccessToken(userId) {
    return this._jwt.token.generate(userId, Config.security.accessTokenKey);
  }

  generateRefreshToken(userId) {
    return this._jwt.token.generate(userId, Config.security.refreshTokenKey);
  }
}

module.exports = JwtTokenManager;
