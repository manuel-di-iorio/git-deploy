const { ctx } = require('./ctx');
const { log } = require('./logger');

exports.start = async (method) => {
  try {
    log.info('***** TASK RUNNER *****');

    await method();

    const totalTimeEnd = (Date.now() - ctx.totalTimeStart) / 1000;
    log.info(`Run completed in ${totalTimeEnd}s.\n\r`);
  } catch (error) {
    log.error(error);
  }
};
