const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistNameExist(name) {
    const query = {
      text: 'SELECT name FROM playlists WHERE name = $1',
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Failed to add create. Name is already in use.');
    }
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows[0].id) {
        throw new InvariantError('Playlist failed to add');
      }
      return result.rows[0].id;
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaylistById(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('playlist failed to delete, id not found');
    }
  }

  async verifyPlaylistExists(playlistId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found');
    }
  }

  async verifySongExist(songId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }
  }

  async checkSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT 1 FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('The song is already in the playlist');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError(
        'You are not authorized to access this resource',
      );
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const result = await this._pool.query({
      text: 'INSERT INTO playlists_songs (playlist_id, song_id) VALUES ($1, $2)',
      values: [playlistId, songId],
    });

    if (!result.rowCount) {
      throw new InvariantError('Failed to add song to playlist');
    }
  }

  async getPlaylistDetail(id) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON playlists.owner = users.id
        WHERE playlists.id = $1
      `,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist detail not found');
    }
    return result.rows[0];
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM songs
        JOIN playlists_songs ON songs.id = playlists_songs.song_id
        WHERE playlists_songs.playlist_id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('song failed to delete, id not found');
    }
  }
}

module.exports = PlaylistsService;
