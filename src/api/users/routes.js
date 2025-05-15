const { options } = require('joi');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: handler.getMyProfileHandler,
    options: { auth: 'openmusicapp_jwt' },
  },
  {
    method: 'PUT',
    path: '/users/me',
    handler: handler.putMyProfileHandler,
    options: { auth: 'openmusicapp_jwt' },
  },
];

module.exports = routes;
