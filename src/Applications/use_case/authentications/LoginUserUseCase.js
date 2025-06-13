const LoginUser = require('../../../Domains/authentications/entities/LoginUser');

class LoginUserUseCase {
  constructor({ userRepository, passwordHash, tokenManager }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const loginUser = new LoginUser(useCasePayload);
    const user = await this._userRepository.findByUsername(loginUser.username);
    await this._passwordHash.compare(
      useCasePayload.password,
      loginUser.password,
    );
    const accessToken = this._tokenManager.generateAccessToken(user.id);
    const refreshToken = this._tokenManager.generateRefreshToken(user.id);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}

module.exports = LoginUserUseCase;
