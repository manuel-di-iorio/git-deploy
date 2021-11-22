const expressWebhook = require('express-github-webhook');
const { log } = require('../lib/logger');
const { startWorkflow } = require('../lib/workflow');

const { WEBHOOK_SECRET, WEBHOOK_BRANCH, DEPLOY_ENDPOINT } = process.env;

exports.githubService = (server) => {
  const webhookHandler = expressWebhook({
    path: DEPLOY_ENDPOINT,
    secret: WEBHOOK_SECRET
  });
  server.use(webhookHandler);

  webhookHandler.on('push', async (repo, data) => {
    if (data.ref !== `refs/heads/${WEBHOOK_BRANCH}`) return;
    log.debug(`Deploy issued by ${data.pusher.name}`);

    try {
      // Start the deploy flow
      await startWorkflow();
    } catch (err) {
      log.error(err);
    }
  });
};
