const SmeeClient = require('smee-client');
const { log } = require('./lib/logger');

const { PORT, SMEE_SOURCE_ENDPOINT, DEPLOY_ENDPOINT } = process.env;

exports.startSmeeProxy = () => {
  const smee = new SmeeClient({
    source: SMEE_SOURCE_ENDPOINT,
    target: `http://localhost:${PORT}${DEPLOY_ENDPOINT}`,
    logger: log.child({ name: 'SMEE' })
  });

  smee.start();
};
