const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborator(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations (id, user_id, playlist_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('collaborations failed to add');
    }

    return result.rows[0].id;
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Collaboration failed to verify');
    }
  }
}

module.exports = CollaborationsService;
