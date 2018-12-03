#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const cp = require('child_process');
const { generateFiles } = require('../utils');
const packageJson = require('../package.json');

async function createApp(projectName) {
  if (fs.pathExistsSync(projectName)) {
    const { action } = await inquirer.prompt([{
      name: 'action',
      type: 'list',
      message: `项目文件夹 ${chalk.green(projectName)} 已存在，请选择一个操作执行：`,
      choices: [
        { name: '覆盖（删除原文件）', value: 'overwrite' },
        { name: '合并（保留原文件）', value: 'merge' },
        { name: '取消', value: false },
      ],
    }]);

    if (!action) {
      return;
    } else if (action === 'overwrite') {
      console.log('正在删除文件，请稍后。。。');
      await fs.remove(projectName);
      console.log('删除完毕');
    }
  }

  const { target, type } = await inquirer.prompt([
    {
      name: 'target',
      type: 'list',
      message: '请选择终端：',
      choices: [
        { name: 'pc端', value: 'pc' },
        { name: '移动端', value: 'mobile' },
        { name: '取消', value: false },
      ],
    },
    {
      name: 'type',
      type: 'list',
      message: '请选择项目类型：',
      choices: ({ target: tar }) => {
        let choices = [];

        if (tar === 'pc') {
          choices = [
            { name: 'SPA (React + React Router + Rematch)', value: 'spa' },
            { name: '组件', value: 'component' },
            { name: '多页面应用', value: 'multiple' },
            { name: '轻量级PC工程', value: 'lite' },
          ];
        }
        if (tar === 'mobile') {
          choices = [{ name: '微信小程序SPY', value: 'spy' }];
        }

        choices.push({ name: '取消', value: false });

        return choices;
      },
    },
  ]);

  if (!target || !type) {
    return;
  }

  await generateFiles(projectName, target, type);

  cp.execSync('npm install', {
    cwd: projectName,
    stdio: 'inherit',
  });
}

program
  .version(packageJson.version);

program
  .command('create')
  .arguments('<project-directory>')
  .option('--branch', 'option to select a branch from repository')
  .description('create a new project.')
  .action((projectName) => {
    createApp(projectName);
  });

program
  .arguments('<command>')
  .action((cmd) => {
    console.log();
    console.log(`  ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
    console.log(`  Please run ${chalk.cyan('tuntu -h')} for more information of usage.`);
    console.log();
  });

program.parse(process.argv);
