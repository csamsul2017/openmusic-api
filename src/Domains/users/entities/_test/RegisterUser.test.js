const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'joko',
      password: 'joko123',
    };

    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('Shold throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      password: true,
      fullname: 'joko',
    };

    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('Should throw error when username contains more than 50 character', () => {
    const payoad = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      password: 'joko123',
      fullname: 'Joko',
    };

    expect(() => new RegisterUser(payoad)).toThrow(
      'REGISTER_USER.USERNAME_LIMIT_CHAR',
    );
  });

  it('Should throw error when username contains restricted character', () => {
    const payload = {
      username: 'Jo ko',
      password: 'joko123',
      fullname: 'Joko',
    };

    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('Should create registerUser object correctly', () => {
    const payload = {
      username: 'joko',
      password: 'joko123',
      fullname: 'Joko',
    };

    const { username, password, fullname } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
    expect(fullname).toEqual(payload.fullname);
  });
});
