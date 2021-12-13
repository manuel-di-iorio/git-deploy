const { dirname, basename } = require('path');
const { cmdSeparator, DEPLOY_SCRIPTS } = require('./config');
const { cmd } = require('./execCmd');
const { log } = require('./logger');

const logger = exports.logger = log.child({ name: 'DEPLOY' });

exports.startWorkflow = async () => {
  try {
    const totalTimeStart = Date.now();

    for (const script of DEPLOY_SCRIPTS) {
      await cmd(`cd ${dirname(script)}${cmdSeparator}sh ./${basename(script)}`, logger);
    }

    const totalTimeEnd = (Date.now() - totalTimeStart) / 1000;
    logger.debug(`Run completed in ${totalTimeEnd}s.`);
  } catch (error) {
    logger.error(error);
  }
};
