const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('Should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'joko' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('joko'),
      ).rejects.toThrow(InvariantError);
    });

    it('Should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('joko'),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('Should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'joko',
        password: 'joko123',
        fullname: 'Joko',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await userRepositoryPostgres.addUser(registerUser);
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('Should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'joko',
        password: 'joko123',
        fullname: 'Joko',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'joko',
          fullname: 'Joko',
        }),
      );
    });
  });

  describe('findByUsername function', () => {
    it('Should throw NotFoundError when username not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      expect(userRepositoryPostgres.findByUsername('joko')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('Should not throw NotFoundError when username is found', async () => {
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      expect(
        userRepositoryPostgres.findByUsername('joko'),
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
