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

  async getMyProfileHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyUserIdExist(credentialId);
    const result = await this._service.getMyProfile(credentialId);

    return h.response({
      status: 'success',
      data: { user: result },
    });
  }

  async putMyProfileHandler(request, h) {
    const { payload, auth } = request;
    const { id: credentialId } = auth.credentials;
    await this._service.verifyUserIdExist(credentialId);
    await this._validator.validatePutUserPayload(payload);
    await this._service.editMyProfile({ credentialId, ...payload });

    return h
      .response({
        status: 'success',
        message: 'User updated',
      })
      .code(200);
  }

  async deleteMyProfileHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    await this._service.deleteMyProfile(credentialId);

    return h
      .response({
        status: 'success',
        message: 'User deleted',
      })
      .code(200);
  }
}

module.exports = UsersHandler;
