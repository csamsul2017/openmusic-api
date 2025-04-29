const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const fs = require('fs');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(folder) {
    this._pool = new Pool();
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async verifyAlbumExist(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album not found');
    }
  }

  async addAlbum({ name, year, coverUrl }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING ID',
      values: [id, name, year, coverUrl],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('song failed to add');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const songResult = await this._pool.query(songQuery);

    if (!result.rows.length) {
      throw new NotFoundError('song failed to edit, id not found');
    }
    const album = result.rows[0];

    return {
      id: album.id,
      name: album.name,
      year: album.year,
      coverUrl: album.cover,
      songs: songResult.rows,
    };
  }

  async editAlbumById({ id, name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album failed to edit, id not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album failed to delete, id not found');
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async updateCoverAlbum(filename, albumId) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [filename, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update cover, album not found');
    }
  }
}

module.exports = AlbumsService;
