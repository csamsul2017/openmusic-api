const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    return h
      .response({
        status: 'success',
        message: 'User successfully added',
        data: { userId },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
