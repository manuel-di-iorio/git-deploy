const { cmdSeparator } = require('./config');
const { cmd } = require('./execCmd');
const { log } = require('./logger');

const { DEPLOY_SCRIPT_PATH, DEPLOY_SCRIPT_FNAME } = process.env;

const logger = exports.logger = log.child({ name: 'DEPLOY' });

exports.startWorkflow = async () => {
  try {
    const totalTimeStart = Date.now();

    await cmd(
      `cd ${DEPLOY_SCRIPT_PATH}${cmdSeparator}sh ./${DEPLOY_SCRIPT_FNAME}`,
      logger
    );

    const totalTimeEnd = (Date.now() - totalTimeStart) / 1000;
    logger.debug(`Run completed in ${totalTimeEnd}s.\n`);
  } catch (error) {
    logger.error(error);
  }
};
