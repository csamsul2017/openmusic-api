const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const { name, year, coverUrl = null } = request.payload;
    const albumId = await this._service.addAlbum({
      name,
      year,
      coverUrl,
      credentialId,
    });

    return h
      .response({
        status: 'success',
        message: 'data successfully added',
        data: { albumId },
      })
      .code(201);
  }

  async getAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAlbumExists(albumId);
    await this._service.verifyAlbumAccess(albumId, credentialId);
    const album = await this._service.getAlbumById(albumId);

    return h
      .response({
        status: 'success',
        data: {
          album,
        },
      })
      .code(200);
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;
    const { year, name } = request.payload;

    await this._service.verifyAlbumExists(albumId);
    await this._service.verifyAlbumAccess(albumId, credentialId);

    await this._service.editAlbumById({ albumId, year, name });
    console.log('ok');
    return h
      .response({
        status: 'success',
        message: 'album successfully updated',
      })
      .code(200);
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;

    await this._service.verifyAlbumExists(albumId);
    await this._service.deleteAlbumById(albumId);

    return h
      .response({
        status: 'success',
        message: 'album successfully deleted',
      })
      .code(200);
  }

  async postCoverAlbumHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const result = await this._service.writeFile(cover, cover.hapi);
    const filename = `http://${config.app.host}:${config.app.port}/albums/images/${result}`;

    await this._service.updateCoverAlbum(filename, albumId);

    return h
      .response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      })
      .code(201);
  }
}

module.exports = AlbumsHandler;
