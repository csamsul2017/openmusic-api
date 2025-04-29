const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaboratorhandler,
    options: { auth: 'openmusicapp_jwt' },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaboratorHandler,
    options: { auth: 'openmusicapp_jwt' },
  },
];

module.exports = routes;
