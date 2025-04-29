/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.dropConstraint('playlists', 'playlists_username_fkey');

  pgm.dropColumn('playlists', 'username');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.addColumn('playlists', 'username');

  pgm.addConstraint('playlists', 'playlist_username_fk', {
    foreignKeys: {
      columns: 'username',
      references: users(username),
      onDelete: 'cascade',
    },
  });
};
