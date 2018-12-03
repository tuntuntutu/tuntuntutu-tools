const path = require('path');
const fs = require('fs-extra');
const readPkg = require('read-pkg');
const writePkg = require('write-pkg');
const stringifyJS = require('javascript-stringify');
const { fetchFromGit } = require('./repository');
const { TEMPLATE_SETTING } = require('../configs');

exports.generateFiles = async (projectName, target, type) => {
  const projectPath = path.join(process.cwd(), projectName);
  const git = TEMPLATE_SETTING[target][type];

  fs.ensureDirSync(projectName);
  await fetchFromGit(projectName, git);

  const pkg = readPkg.sync(projectPath);
  const appConfig = require(`${projectPath}/tuntuntutu.config.js`);

  /* eslint-disable-next-line no-underscore-dangle */
  delete pkg._id;
  delete pkg.readme;
  pkg.name = projectName;
  appConfig.name = projectName;
  appConfig.platform = target;
  appConfig.type = type;

  writePkg.sync(projectPath, pkg);
  fs.outputFileSync(`${projectPath}/tuntuntutu.config.js`, `module.exports = ${stringifyJS(appConfig, null, 2)}`);
};
