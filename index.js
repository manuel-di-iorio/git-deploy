const { promises: fs } = require('fs');
const yaml = require('js-yaml');
const { run } = require('./lib/runStep');
const { start } = require('./lib/start');
const { cmd } = require('./lib/execCmd');

const cmdSeparator = process.platform === 'win32' ? ' && ' : '; ';

const runService = async (service) => {
  let rootFolder;
  let projectPath;
  let dockerScriptArg;
  let kubePath;

  // Configure the paths
  switch (service) {
    case 'pwa':
      rootFolder = 'myald-pwa';
      projectPath = rootFolder;
      dockerScriptArg = '';
      kubePath = `myald-kube/deployments/frontends/${service}.yml`;
      break;

    case 'bo-frontend':
      rootFolder = 'myald-bo';
      projectPath = rootFolder;
      dockerScriptArg = '';
      kubePath = `myald-kube/deployments/frontends/${service}.yml`;
      break;

    default:
      rootFolder = 'myald-microservices';
      projectPath = `${rootFolder}/packages/${service}-service`;
      dockerScriptArg = `${service}-service`;
      kubePath = `myald-kube/deployments/microservices/${service}.yml`;
  }

  // Pull the new changes from the repository
  await run('PULL REPOSITORY CHANGES', async () => cmd(`cd ${rootFolder + cmdSeparator}git pull origin develop`));

  // Patch the service version
  await run('PATCH SERVICE VERSION', async () => cmd(`cd ${projectPath + cmdSeparator}npm version patch`));

  // Grab the new version
  const newVersion = require(`../${projectPath}/package.json`).version;

  await Promise.all([
    // Push the version change on the service repository
    run('PUSH SERVICE VERSION CHANGE', async () => cmd(`cd ${rootFolder + cmdSeparator}git add .${cmdSeparator}git commit -m "Automatic Version Patch - ${service}:${newVersion}"${cmdSeparator}git push origin develop`)),

    // Deploy the image to Azure
    run('AZURE DEPLOY', async () => cmd(`cd ${rootFolder + cmdSeparator}sh ./docker-script.sh ${dockerScriptArg}`)),

    // Patch the kube deploy version
    run('PATCH KUBE DEPLOY VERSION', async () => {
      // Read the YML file
      let data = await fs.readFile(kubePath, 'utf8');
      const yml = yaml.safeLoad(data);

      // Change the version
      yml.spec.template.spec.containers[0].image = yml.spec.template.spec.containers[0].image.split(':')[0] +
        ':' + newVersion;

      // Write the object back to the YML file
      data = yaml.safeDump(yml);
      await fs.writeFile(kubePath, data);
    })
  ]);

  await Promise.all([
    // Push the version change on the kube repository
    run('PUSH KUBE VERSION CHANGE', async () => (
      cmd(`cd myald-kube${cmdSeparator}git add .${cmdSeparator}git commit -m "Automatic Version Patch - ${service}:${newVersion}"${cmdSeparator}git push origin master`)
    )),

    // Deploy the image to Kubernetes
    run('KUBE DEPLOY', async () => cmd(`kubectl replace -f ${kubePath}`))
  ]);
};

/**
 * Start the task runner
 */
start(async () => {
  const services = process.argv.slice(2);
  if (!services.length) throw new Error('Missing services. Example usage:\r\n$ node deploy pwa');

  for (const service of services) {
    await runService(service);
  }
});
