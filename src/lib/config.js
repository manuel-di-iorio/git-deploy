const dotenv = require('dotenv');

dotenv.config();

exports.cmdSeparator = process.platform === 'win32' ? ' && ' : '; ';
exports.SMEE_ENABLE = process.env.SMEE_ENABLE === 'true';
exports.DEPLOY_SCRIPTS = process.env.DEPLOY_SCRIPTS && process.env.DEPLOY_SCRIPTS.split(',');
