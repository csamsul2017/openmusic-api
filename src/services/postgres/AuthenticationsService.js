const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token, username) {
    const getUserIdQuery = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };
    const resultUserId = await this._pool.query(getUserIdQuery);
    const userId = resultUserId.rows[0].id;
    const query = {
      text: 'INSERT INTO authentications VALUES($1, $2)',
      values: [token, userId],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token is invalid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
