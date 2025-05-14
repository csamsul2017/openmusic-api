const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    const { payload } = request;
    this._validator.validatePostUserPayload(payload);
    const userId = await this._service.addUser({ ...payload });

    return h
      .response({
        status: 'success',
        message: 'User successfully added',
        data: { userId },
      })
      .code(201);
  }

  async putUserHandler(request, h) {
    const { payload, auth } = request;
    const { id: credentialId } = auth.credentials;
    await this._validator.validatePutUserPayload(payload);
    await this._service.editUser({ credentialId, ...payload });

    return h
      .response({
        status: 'success',
        message: 'User updated',
      })
      .code(200);
  }
}

module.exports = UsersHandler;
