const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "time,pid,hostname",
    },
  },
});

module.exports = logger;
