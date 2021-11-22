const express = require('express');
const bodyParser = require('body-parser');
const expressHelmet = require('helmet');
const { SMEE_ENABLE } = require('./lib/config');
const { log } = require('./lib/logger');
const { webhookMethod } = require('./methods/webhook');
const { startSmeeProxy } = require('./smee');

const server = express();
const { PORT, LISTEN_METHOD } = process.env;

// Server middlewares
server.use(expressHelmet());
server.use(bodyParser.json());

// Listening methods
const listeningMethods = { webhook: webhookMethod };
listeningMethods[LISTEN_METHOD](server);

// Start Smee proxy
if (SMEE_ENABLE) {
  startSmeeProxy();
}

server.use((err, req, res, next) => {
  log.error(err);
  if (!res.headersSent) res.sendStatus(500);
});

// Start the webserver
server.listen(PORT, (err) => {
  if (err) throw err;
  log.info('Server listening on port ' + PORT);
});
