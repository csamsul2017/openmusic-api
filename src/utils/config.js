const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    url: process.env.REDIS_SERVER,
  },
};

module.exports = config;
