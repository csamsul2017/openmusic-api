const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, playlistsService, usersService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaboratorhandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._usersService.verifyUserIdExist(userId);
    const collab_id = await this._service.addCollaborator(playlistId, userId);

    return h
      .response({
        status: 'success',
        data: {
          collaborationId: collab_id,
        },
      })
      .code(201);
  }

  async deleteCollaboratorHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaborator(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Collaboration successfully deleted',
    });
  }
}

module.exports = CollaborationsHandler;
