const AuthRepository = require('../AuthRepository');

describe('AuthRepository class', () => {
  it('Should throw erro when calling abstract behavior', async () => {
    const authRepository = new AuthRepository();
    expect(authRepository.addRefreshToken('')).rejects.toThrow(
      'ADD_REFRESH_TOKEN.METHOD_NOT_IMPLEMENTED',
    );
  });
});
