const LoginUserUseCase = require('../LoginUserUseCase');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AuthRepository = require('../../../../Domains/authentications/AuthRepository');
const PasswordHash = require('../../../security/PasswordHash');
const TokenManager = require('../../../security/TokenManager');

describe('LoginUserUseCase', () => {
  it('Should orchestrating the login user correctly', async () => {
    const useCasePayload = {
      username: 'joko',
      password: 'joko123',
    };
    const mockUserFromDb = {
      id: 'user-123',
      username: 'joko',
      password: 'joko123',
    };
    const mockAccessToken = 'this is mock access token';
    const mockRefreshToken = 'this is mock refresh token';
    const mockUserRepository = new UserRepository();
    const mockAuthRepository = new AuthRepository();
    const mockPasswordHash = new PasswordHash();
    const mockTokenManager = new TokenManager();

    mockUserRepository.findByUsername = jest
      .fn()
      .mockResolvedValue(mockUserFromDb);
    mockAuthRepository.addRefreshToken = jest.fn().mockResolvedValue();
    mockPasswordHash.compare = jest.fn().mockResolvedValue(true);
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockReturnValue(mockAccessToken);
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockReturnValue(mockRefreshToken);

    const mockLoginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authRepository: mockAuthRepository,
      passwordHash: mockPasswordHash,
      tokenManager: mockTokenManager,
    });
    const result = await mockLoginUserUseCase.execute(useCasePayload);

    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
      useCasePayload.username,
    );
    expect(mockAuthRepository.addRefreshToken).toHaveBeenCalledWith(
      mockRefreshToken,
      mockUserFromDb.id,
    );
    expect(mockPasswordHash.compare).toHaveBeenCalledWith(
      useCasePayload.password,
      mockUserFromDb.password,
    );
    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledWith(
      'user-123',
    );
    expect(mockTokenManager.generateRefreshToken).toHaveBeenCalledWith(
      'user-123',
    );
    expect(result.accessToken).toEqual(mockAccessToken);
    expect(result.refreshToken).toEqual(mockRefreshToken);
  });
});
