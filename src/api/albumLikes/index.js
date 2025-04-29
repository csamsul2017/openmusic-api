const routes = require('./routes');
const AlbumLikesHandler = require('./handler');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { service, albumsService }) => {
    const albumLikesHandler = new AlbumLikesHandler(service, albumsService);
    server.route(routes(albumLikesHandler));
  },
};
