const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const { id: user_id } = request.auth.credentials;
    const { title, year, genre, performer, duration, albumId } =
      request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      user_id,
    });

    return h
      .response({
        status: 'success',
        message: 'data successfully added',
        data: { songId },
      })
      .code(201);
  }

  async getSongsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const result = await this._service.getSongs(credentialId);

    return h
      .response({
        status: 'success',
        data: { songs: result },
      })
      .code(200);
  }

  async getSongByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: songId } = request.params;
    await this._service.verifySongExists(songId);
    await this._service.verifySongAccess(songId, credentialId);
    const song = await this._service.getSongById(songId);

    return h
      .response({
        status: 'success',
        data: {
          song,
        },
      })
      .code(200);
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: songId } = request.params;
    await this._service.verifySongExists(songId);
    await this._service.verifySongAccess(songId, credentialId);
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    await this._service.editSongById({
      songId,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return h
      .response({
        status: 'success',
        message: 'song successfully updated',
      })
      .code(200);
  }

  async deleteSongByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: songId } = request.params;
    await this._service.verifySongExists(songId);
    await this._service.verifySongAccess(songId, credentialId);
    await this._service.deleteSongById(songId);

    return h
      .response({
        status: 'success',
        message: 'song successfully deleted',
      })
      .code(200);
  }
}

module.exports = SongsHandler;
