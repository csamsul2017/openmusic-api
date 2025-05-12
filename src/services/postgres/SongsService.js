const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
    user_id,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ID',
      values: [id, title, year, genre, performer, duration, albumId, user_id],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('song failed to add');
    }
    return result.rows[0].id;
  }

  async getSongs(credentialId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE user_id = $1',
      values: [credentialId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to edit, id not found');
    }
    return result.rows[0];
  }

  async editSongById({
    songId,
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to edit, id not found');
    }
  }

  async deleteSongById(dongId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to delete, id not found');
    }
  }

  async verifySongExists(songId) {
    const query = {
      text: 'SELECT id FROM songs where id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song id not exists');
    }
  }

  async verifySongAccess(songId, credentialId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1 and user_id = $2',
      values: [songId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError(
        'You do not have permission to access this song',
      );
    }
  }
}

module.exports = SongsService;
