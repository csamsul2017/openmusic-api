const { options } = require('joi');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'PUT',
    path: '/users',
    handler: handler.putUserHandler,
    options: { auth: 'openmusicapp_jwt' },
  },
];

module.exports = routes;
