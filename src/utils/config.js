require('dotenv').config();

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    url: process.env.REDIS_SERVER,
  },
};

module.exports = config;
