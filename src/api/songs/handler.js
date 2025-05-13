const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    autoBind(this);
  }

  async _authorizeSong(songId, credentialId) {
    await this._service.verifySongExists(songId);
    await this._service.verifySongAccess(songId, credentialId);
  }

  async postSongHandler(request, h) {
    const { payload, auth } = request;
    const { id: user_id } = auth.credentials;
    this._validator.validateSongsPayload(payload);
    const songId = await this._service.addSong({ ...payload, user_id });

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
    await this._authorizeSong(songId, credentialId);
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
    const { payload, auth, params } = request;
    const { id: credentialId } = auth.credentials;
    const { id: songId } = params;
    this._validator.validateSongsPayload(payload);
    await this._authorizeSong(songId, credentialId);
    await this._service.editSongById({ songId, ...payload });

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
    await this._authorizeSong(songId, credentialId);
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
