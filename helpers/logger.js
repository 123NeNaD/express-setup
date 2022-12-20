const winston = require('winston');
const Config = require('../config');

// Levels: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']
const logger = winston.createLogger();

const customFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) =>
    `${level}: ${message}\n${metadata && Object.keys(metadata).length ? JSON.stringify(metadata, null, 4) : ''}`
);

// If we're not in production then we will log to the console with the format:
// `${info.level}: ${info.message} {...rest}`
if (Config.node_environment !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: customFormat,
    })
  );
}

module.exports = {
  logger,
};
