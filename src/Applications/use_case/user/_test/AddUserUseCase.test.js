const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUserUseCase', () => {
  it('Should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'joko',
      password: 'joko123',
      fullname: 'Joko',
    };
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    // Creating dependency of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
