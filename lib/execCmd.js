const { exec } = require('child_process');
const { log } = require('./logger');

exports.cmd = (command) => {
  log.trace(`$ ${command}`);

  return new Promise((resolve, reject) => {
    const cmd = exec(command);
    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);
    cmd.on('exit', resolve);
    cmd.on('error', reject);
  });
};
