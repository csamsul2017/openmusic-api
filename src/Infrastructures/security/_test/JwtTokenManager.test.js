const JwtTokenManager = require('../JwtTokenManager');
const Jwt = require('@hapi/jwt');

describe('JwtTokenManager', () => {
  let jwtTokenManager;

  beforeEach(() => {
    jwtTokenManager = new JwtTokenManager(Jwt);
  });

  describe('generateAccessToken function', () => {
    it('Should generate access token correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const mockUserId = 'user-123';
      const tokenKeys = process.env.ACCESS_TOKEN_KEY;
      const accessToken = await jwtTokenManager.generateAccessToken(
        mockUserId,
        tokenKeys,
      );

      expect(typeof accessToken).toBe('string');
      expect(accessToken).not.toEqual('');
      expect(accessToken.split('.').length).toBe(3);
    });
  });

  describe('generateRefreshToken function', () => {
    it('Should generate refresh token correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const mockUserId = 'user-123';
      const tokenKeys = process.env.ACCESS_TOKEN_KEY;
      const refreshToken = await jwtTokenManager.generateAccessToken(
        mockUserId,
        tokenKeys,
      );

      expect(typeof refreshToken).toBe('string');
      expect(refreshToken).not.toEqual('');
      expect(refreshToken.split('.').length).toBe(3);
    });
  });
});
