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
    const { title, year, genre, performer, duration, albumId } =
      request.payload;
    const songId = await this._service.addSong({
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
        message: 'data successfully added',
        data: { songId },
      })
      .code(201);
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const result = await this._service.getSongs({ title, performer });

    return h
      .response({
        status: 'success',
        data: { songs: result },
      })
      .code(200);
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

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

    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    await this._service.editSongById({
      id,
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
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return h
      .response({
        status: 'success',
        message: 'song successfully deleted',
      })
      .code(200);
  }
}

module.exports = SongsHandler;
