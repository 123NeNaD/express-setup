module.exports = {
  node_environment: process.env.NODE_ENV,
  server: {
    port: process.env.SERVER_PORT,
  },
  database: {
    connection_string: process.env.DATABASE_CONNECTION_STRING,
  },
};
