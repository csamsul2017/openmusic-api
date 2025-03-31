const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

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

  async getSongsHandler() {
    const result = await this._service.getSongs();

    const songs = result.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));

    return {
      status: 'success',
      data: { songs },
    };
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
