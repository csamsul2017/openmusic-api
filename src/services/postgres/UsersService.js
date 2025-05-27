const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Failed to add user. Username is already in use.',
      );
    }
  }

  async verifyUserCred(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Id not found');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError(
        'The credentials you provided are incorrect',
      );
    }
    return id;
  }

  async addUser(payload) {
    const { username, password, fullname } = payload;
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING ID',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User failed to add');
    }
    return result.rows[0].id;
  }

  async getMyProfile(userId) {
    const query = {
      text: 'SELECT users.username, users.fullname FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async editMyProfile(payload) {
    const { credentialId, username, password, fullname } = payload;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const fields = { username, password: hashedPassword, fullname };
    const keys = Object.keys(fields);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = fields[key];
      if (value) {
        await this._pool.query(`UPDATE users SET ${key} = $1 WHERE id = $2`, [
          value,
          credentialId,
        ]);
      }
    }
  }

  async verifyUserIdExist(userId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Users not found');
    }
  }

  async deleteMyProfile(userId) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('user failed to delete, id not found');
    }
  }
}

module.exports = UsersService;
