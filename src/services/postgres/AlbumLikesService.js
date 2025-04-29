const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikes {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlbumLikesExist(userId, albumId) {
    const query = {
      text: 'SELECT 1 FROM user_album_likes WHERE user_id = $1 AND album_id = $2 LIMIT 1',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      // dia akan mengembalikan true jika tidak ada like
      throw new InvariantError('Album sudah di like');
    }
  }

  async addAlbumLikes(userId, albumId) {
    const id = `albumLikes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING ID',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like failed');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Like failed');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      return {
        isCache: true,
        result: JSON.parse(result),
      };
    } catch {
      const query = {
        text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likeCount = parseInt(result.rows[0].likes, 10);

      await this._cacheService.set(
        `albumLikes:${albumId}`,
        JSON.stringify(likeCount),
      );

      return {
        isCache: false, // bahwa ini bukan dari cache
        result: likeCount,
      };
    }
  }
}

module.exports = AlbumLikes;
