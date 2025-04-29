const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;
    autoBind(this);
  }

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.verifyAlbumExist(albumId);

    const isLiked = await this._service.verifyAlbumLikesExist(userId, albumId);

    if (!isLiked) {
      await this._service.addAlbumLikes(userId, albumId);
    }

    return h
      .response({
        status: 'success',
        message: 'Album liked',
      })
      .code(201);
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.verifyAlbumExist(albumId);
    // await this._service.verifyAlbumLikesExist(userId, albumId);

    await this._service.deleteAlbumLikes(userId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Album unliked',
      })
      .code(200);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { isCache, result } = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: result,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }

    return response;
  }
}

module.exports = AlbumLikesHandler;
