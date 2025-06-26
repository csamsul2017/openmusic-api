const LoginUserUseCase = require('../../../../Applications/use_case/authentications/LoginUserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.postAuthenticationsHandler =
      this.postAuthenticationsHandler.bind(this);
  }

  // Request = id
  async postAuthenticationsHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      request.payload,
    );

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  }
}

module.exports = AuthenticationsHandler;
