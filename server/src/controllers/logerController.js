const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json({
      format: "YYYY-MM-DD   HH:mm:ss",
    })
  ),

  transports: [
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
    }),
  ],
  transports: [
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
    }),
  ],
});
module.exports = logger;
