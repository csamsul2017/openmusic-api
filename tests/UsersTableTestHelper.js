/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'joko',
    password = 'joko123',
    fullname = 'Joko',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };
    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async findByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const result = pool.query(query);
    return result.rows;
  },

  async findByRefreshToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('TRUNCATE users CASCADE');
  },
};

module.exports = UsersTableTestHelper;
