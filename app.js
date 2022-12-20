require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const httpLogger = require('morgan');
const { logger } = require('./helpers/logger');
const Config = require('./config');

mongoose.connect(Config.database.connection_string).then(() => {
  logger.log('info', 'Successfully connected to database.');

  const app = express();
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  if (Config.node_environment === 'development') {
    app.use(httpLogger('dev'));
  } else {
    app.use(
      httpLogger(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
        { stream: { write: (message) => logger.log('info', message.trim(), { tags: ['http'] }) } }
      )
    );
  }

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    logger.log('error', `Endpoint not found`);
    const error = new Error('Endpoint not found.');
    error.status = 404;
    next(error);
  });

  // Error handler
  app.use((error, req, res, next) =>
    res.status(error.status || 500).json({
      message: error.message,
      error: Config.node_environment === 'development' ? error : {},
      title: 'Error',
    })
  );

  const server = http.createServer(app);

  server.listen(Config.server.port || 3000, () => {
    logger.log('info', `Server is listening on port ${server.address().port}`);
  });
});
