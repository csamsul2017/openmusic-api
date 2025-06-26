const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');
// const config = require('../../../Commons/config');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('AuthRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addRefreshToken function', () => {
    it('Should persist refresh token in the database', async () => {
      // Create user
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      //   Initial object auth
      const authRepository = new AuthRepositoryPostgres(pool);
      // create token
      const mockRefreshToken = 'secret.refresh.token';
      // add token to db
      await authRepository.addRefreshToken(mockRefreshToken, 'user-123');
      // find token in db use userstabletesthelper
      const result =
        await UsersTableTestHelper.findByRefreshToken(mockRefreshToken);
      // expect length and equal value
      expect(result.token.split('.')).toHaveLength(3);
      expect(result.token).toEqual(mockRefreshToken);
    });
  });
});
