const LoginUserUseCase = require('../LoginUserUseCase');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../security/PasswordHash');
const TokenGenerator = require('../../../security/TokenGenerator');

describe('LoginUserUseCase', () => {
  it('Should orchestrating the login user correctly', async () => {
    const useCasePayload = {
      username: 'joko',
      password: 'joko123',
    };
    const mockUserFromDb = {
      username: 'joko',
      password: 'joko123',
    };
    const mockAccessToken = 'this is mock token';
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockTokenGenerator = new TokenGenerator();

    mockUserRepository.findByUsername = jest
      .fn()
      .mockResolvedValue(mockUserFromDb);
    mockPasswordHash.compare = jest.fn().mockResolvedValue(true);
    mockTokenGenerator.generate = jest.fn().mockReturnValue(mockAccessToken);

    const mockLoginUserUseCase = new LoginUserUseCase({
      mockUserRepository,
      mockPasswordHash,
      mockTokenGenerator,
    });
    const result = await mockLoginUserUseCase.execute(
      useCasePayload.username,
      useCasePayload.password,
    );

    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.compare).toHaveBeenCalledWith(
      useCasePayload.password,
      mockUserFromDb.password,
    );
    expect(mockTokenGenerator.generate).toHaveBeenCalledWith({
      id: 'user-123',
      username: 'joko',
    });
    expect(result.token).toEqual(mockAccessToken);
    expect(result.user).not.toHaveProperty('password');
  });
});
