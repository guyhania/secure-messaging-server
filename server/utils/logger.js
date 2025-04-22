const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/audit.log' }) // Log to file
  ]
});

module.exports = logger;
