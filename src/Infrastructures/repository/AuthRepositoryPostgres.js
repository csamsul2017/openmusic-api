const AuthRepository = require('../../Domains/authentications/AuthRepository');

class AuthRepositoryPostgres extends AuthRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addRefreshToken(token, userId) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1, $2)',
      values: [token, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = AuthRepositoryPostgres;
