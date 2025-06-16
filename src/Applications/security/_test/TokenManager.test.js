const TokenManager = require('../TokenManager');

describe('TokenManager interfaces', () => {
  it('Should throw error when invoke abstract behavior', () => {
    const tokenManager = new TokenManager();
    expect(tokenManager.generateAccessToken('user-123')).rejects.toThrow(
      'ACCESS_TOKEN.METHOD_NOT_IMPLEMENTED',
    );
    expect(tokenManager.generateRefreshToken('user-123')).rejects.toThrow(
      'REFRESH_TOKEN.METHOD_NOT_IMPLEMENTED',
    );
  });
});
