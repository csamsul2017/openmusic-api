const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entities', () => {
  it('Should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'joko',
      fullname: 'Joko',
    };

    expect(() => new RegisteredUser(payload)).toThrow(
      'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('Should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      username: 'joko',
      fullname: 'Joko',
    };

    expect(() => new RegisteredUser(payload)).toThrow(
      'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('Sould create registeredUser object correctly', () => {
    const payload = {
      id: 'user-123',
      username: 'joko',
      fullname: 'Joko',
    };

    const { id, username, fullname } = new RegisteredUser(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
  });
});
