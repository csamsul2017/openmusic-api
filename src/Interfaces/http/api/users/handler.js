const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;
    this.posUserHandler = this.posUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);
    return h
      .response({
        status: 'success',
        data: {
          addedUser,
        },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
