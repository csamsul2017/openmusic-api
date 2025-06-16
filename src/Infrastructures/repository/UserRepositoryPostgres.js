const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Username already exists');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };
    const result = await this._pool.query(query);
    return new RegisteredUser({ ...result.rows[0] });
  }

  async findByUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Username not found');
    }
  }
}

module.exports = UserRepositoryPostgres;
