const LoginUser = require('../../../Domains/authentications/entities/LoginUser');

class LoginUserUseCase {
  constructor({ userRepository, authRepository, passwordHash, tokenManager }) {
    // Dependency injection, yg dikirim dari container
    this._userRepository = userRepository;
    this._authRepository = authRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const loginUser = new LoginUser(useCasePayload);
    const user = await this._userRepository.findByUsername(loginUser.username);
    await this._passwordHash.compare(useCasePayload.password, user.password);
    const accessToken = await this._tokenManager.generateAccessToken(user.id);
    const refreshToken = this._tokenManager.generateRefreshToken(user.id);
    // console.log(user);
    await this._authRepository.addRefreshToken(refreshToken, user.id);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}

module.exports = LoginUserUseCase;
