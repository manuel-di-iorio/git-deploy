const { bitbucketService } = require('../services/bitbucket');
const { githubService } = require('../services/github');

const { WEBHOOK_SERVICE } = process.env;

exports.webhookMethod = (server) => {
  const services = { github: githubService, bitbucket: bitbucketService };
  const service = services[WEBHOOK_SERVICE];

  if (!service) {
    throw new Error(`Service ${WEBHOOK_SERVICE} not found. Available services: github, bitbucket`);
  }

  service(server);
};
