const LoginUser = require('../LoginUser');

describe('a LoginUser entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'joko',
    };

    expect(() => new LoginUser(payload)).toThrow(
      'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('Should throw error when payload did not contain data type specification', () => {
    const payload = {
      username: 'joko',
      password: true,
    };

    expect(() => new LoginUser(payload)).toThrow(
      'LOGIN_USER.NOT_CONTAIN_DATA_TYPE_SPECIFICATION',
    );
  });

  it('Should create loginUser object correctly', () => {
    const payload = {
      username: 'joko',
      password: 'joko123',
    };
    const { username, password } = new LoginUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
