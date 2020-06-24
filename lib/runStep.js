const { ctx } = require('./ctx');
const { log } = require('./logger');

exports.run = async (name, method) => {
  log.debug(`[${name}] Executing..`);
  const timeStart = Date.now();

  await method(ctx);

  const timeEnd = (Date.now() - timeStart) / 1000;
  log.debug(`[${name}] Step executed in ${timeEnd}s.\n`);
};
