const { log } = require('../lib/logger');
const { startWorkflow, logger } = require('../lib/workflow');

const { WEBHOOK_SECRET, WEBHOOK_BRANCH, DEPLOY_ENDPOINT } = process.env;

exports.bitbucketService = (server) => {
  server.post(DEPLOY_ENDPOINT, async (req, res) => {
    try {
      if (req.headers['x-hook-uuid'] !== WEBHOOK_SECRET || req.headers['x-event-key'] !== 'repo:push') {
        return res.sendStatus(401);
      }

      const event = req.body;
      const commit = event.push.changes[0];
      if (!commit || commit.new.name !== WEBHOOK_BRANCH) return res.sendStatus(204);
      logger.debug(`Issued push by ${event.actor.nickname}`);
      logger.debug(`Commit ${commit.new.target.hash}: ${commit.new.target.message}`);

      // Start the deploy flow
      await startWorkflow();

      res.sendStatus(204);
    } catch (err) {
      log.error(err);
    }
  });
};
