const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

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
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ID',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('song failed to add');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer } = {}) {
    let query = 'SELECT id, title, performer FROM songs WHERE 1=1';
    const values = [];

    if (title) {
      query += ` AND title ILIKE $${values.length + 1}`;
      values.push(`%${title}%`);
    }

    if (performer) {
      query += ` AND performer ILIKE $${values.length + 1}`;
      values.push(`%${performer}%`);
    }

    const result = await this._pool.query({ text: query, values });
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to edit, id not found');
    }
    return result.rows[0];
  }

  async editSongById({
    id,
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to edit, id not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to delete, id not found');
    }
  }
}

module.exports = SongsService;
