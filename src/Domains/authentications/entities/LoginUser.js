class LoginUser {
  constructor(payload) {
    this._verifyPayload(payload);
    const { username, password } = payload;
    this.username = username;
    this.password = password;
  }

  _verifyPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_CONTAIN_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LoginUser;
