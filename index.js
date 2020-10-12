const express = require('express');
const expressHelmet = require('helmet');
const expressWebhook = require('express-github-webhook');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { run } = require('./lib/runStep');
const { start } = require('./lib/start');
const { cmd } = require('./lib/execCmd');
const { log } = require('./lib/logger');

const server = express();
dotenv.config();
const { PROJECT_PATH, PORT, WEBHOOK_SECRET, DEPLOY_BRANCH } = process.env;
const cmdSeparator = process.platform === 'win32' ? ' && ' : '; ';
const webhookHandler = expressWebhook({ path: '/webhook', secret: WEBHOOK_SECRET });

// Server middlewares
server.use(expressHelmet());
server.use(bodyParser.json());
server.use(webhookHandler);

webhookHandler.on('push', async (repo, data) => {
  if (data.ref !== `refs/heads/${DEPLOY_BRANCH}`) return;
  log.debug(`Deploy issued by ${data.pusher.name}`);

  try {
    // Start the deploy flow
    await start(async () => {
      await run('DEPLOY', async () => cmd(`cd ${PROJECT_PATH}${cmdSeparator}sh ./deploy.sh`));
    });
  } catch (err) {
    log.error(err);
  }
});

server.use((err, req, res, next) => {
  log.error(err);
  if (!res.headersSent) res.sendStatus(500);
});

// Start the webserver
server.listen(PORT, (err) => {
  if (err) throw err;
  log.info('Listening on port ' + PORT);
});
