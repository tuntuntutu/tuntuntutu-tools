const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const ROOT_PATH = path.resolve(process.cwd());

// 读取工程配置文件
exports.getConfig = () => {
  const configPath = path.resolve(process.cwd(), 'tuntuntutu.config.js');

  if (!fs.existsSync(configPath)) {
    console.log();
    console.log(`  Oops! ${chalk.green('tuntuntutu.config.js')} is missing.`);
    console.log();
    console.log('  You can create it manually,');
    console.log(`  or run ${chalk.cyan('tuntu init')} to fix it automatically.`);
    console.log();
    process.exit(1);
  }

  return require(configPath);
};
// 按需加载配置识别
exports.hasSideEffects = (moduleName) => {
  const modulePkg = require(`${ROOT_PATH}/node_modules/${moduleName}/package.json`);
  const { sideEffects } = modulePkg;

  if (sideEffects === 'false' || sideEffects === false || Array.isArray(sideEffects)) {
    return false;
  }
  return true;
};
