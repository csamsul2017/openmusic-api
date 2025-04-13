const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { username } = request.auth.credentials;

    await this._service.verifyPlaylistNameExist(name);

    console.log(name);
    const playlistId = await this._service.addPlaylist({ name, username });

    return h
      .response({
        status: 'success',
        message: 'data successfully added',
        data: { playlistId },
      })
      .code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id } = request.auth.credentials;

    const playlists = await this._service.getPlaylistById(id);

    return h.response({
      status: 'success',
      data: { playlists },
    });
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { username } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, username);
    await this._service.verifyPlaylistNameExist(playlistId);
    await this._service.deletePlaylistById(playlistId);

    return h.response({
      status: 'success',
      message: 'Playlist successfully deleted',
    });
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongIdPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { username } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, username);
    await this._service.verifySongExist(songId);
    await this._service.checkSongInPlaylist(playlistId, songId);
    await this._service.addSongToPlaylist(playlistId, songId);

    return h
      .response({
        status: 'success',
        message: 'Song successfully added to playlist',
      })
      .code(201);
  }

  async getSongInPlaylistById(request, h) {
    const { id: playlistId } = request.params;
    const { username } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, username);
    await this._service.verifyPlaylistNameExist(playlistId);
    const playlist = await this._service.getPlaylistDetail(playlistId);
    const songs = await this._service.getSongsFromPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
          songs: songs,
        },
      },
    });
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateDeleteSongIdPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { username } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, username);
    await this._service.verifySongExist(songId);
    await this._service.deleteSongFromPlaylist(songId);

    return h.response({
      status: 'success',
      message: 'song successfully deleted',
    });
  }
}

module.exports = PlaylistsHandler;
