const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({ url: config.redis.url });
    this._client.on('error', (error) => {
      console.log(error);
    });
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache not found');
    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
