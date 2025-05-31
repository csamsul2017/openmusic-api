const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, songsService }) => {
    const playlistsHandler = new PlaylistsHandler(
      service,
      validator,
      songsService,
    );
    server.route(routes(playlistsHandler));
  },
};
