const { Pool } = require('pg');
const nanoid = require('nanoid');

class PlaylistActivities {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities() {
    const id = `activities-${nanoid(16)}`;
  }
}
