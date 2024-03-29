const pino = require('pino');

const logger = pino({
  level: 'trace',
  name: 'CORE',
  prettyPrint: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname'
  }
});

exports.log = logger;
