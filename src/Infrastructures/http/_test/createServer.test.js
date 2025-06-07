const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('Should response 404 when request unregistered route', async () => {
    const server = await createServer({});
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });
    expect(response.statusCode).toEqual(404);
  });

  describe('When POST /users', () => {
    it('Should response 201 and persisted user', async () => {
      const requestPayload = {
        username: 'joko',
        password: 'joko123',
        fullname: 'Joko',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('Should response 404 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'Joko',
        password: 'joko123',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot create new user because required property is missing',
      );
    });

    it('Should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'joko',
        password: 'joko123',
        fullname: ['Joko'],
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'do not create new user because data type not match',
      );
    });

    it('Should response 400 when username more than 50 character', async () => {
      const requestPayload = {
        username:
          'jokoanwarjokoanwarjokoanwarjokoanwarjokoanwarjokoanwarjokoanwar',
        password: 'joko123',
        fullname: 'Joko',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Cannot create new user because username characters exceed limit',
      );
    });

    it('Should response 400 when username contain restricted character', async () => {
      const requestPayload = {
        username: 'jo ko',
        password: 'joko123',
        fullname: 'Joko',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'Cannot create new user because username contains prohibited characters',
      );
    });

    it('Should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ username: 'joko' });
      const requestPayload = {
        username: 'joko',
        password: 'joko123',
        fullname: 'Joko',
      };
      const server = await server.inject(container);
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      ecpect(responseJson.message).toEqual('Username not available');
    });

    it('Should handle server error correctly', async () => {
      const requestPayload = {
        username: 'joko',
        password: 'joko123',
        fullname: 'Joko',
      };
      const server = await createServer({});
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('An error occurred on our server');
    });
  });
});
