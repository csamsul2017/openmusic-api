const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Hash function', () => {
    it('Should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('Compare function', () => {
    it('Should compare password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'compare');
      const plainPassword = 'plain_password';
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);
      const compareResult = await bcryptPasswordHash.compare(
        plainPassword,
        encryptedPassword,
      );
      expect(compareResult).toEqual(true);
      expect(spyHash).toHaveBeenCalledWith(plainPassword, encryptedPassword);
    });

    it('Should throw AuthenticationError when compare password incorrectly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'compare');
      const mockPassword = 'plain_password';
      const mockEncryptedPassowrd = 'plain_password2';
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      expect(
        bcryptPasswordHash.compare(mockPassword, mockEncryptedPassowrd),
      ).rejects.toThrow('Password incorrectly');
      expect(spyHash).toHaveBeenCalledWith(mockPassword, mockEncryptedPassowrd);
    });
  });
});
