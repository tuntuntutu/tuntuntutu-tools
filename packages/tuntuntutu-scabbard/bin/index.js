#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const internalIp = require('internal-ip');
const open = require('better-opn');
const packageJson = require('../package.json');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { generateWebpackConfig } = require('../utils');
const { getConfig } = require('tuntuntutu-utils');

const appConfig = getConfig();
const defaluts = {
  host: internalIp.v4.sync(),
  port: 8088,
  https: false,
};

program
  .version(packageJson.version);

program
  .command('serve')
  .option('--https', 'Use https')
  .option('--host <host>', 'Change service host.', defaluts.host)
  .option('--port <port>', 'Change service port.', defaluts.port)
  .option('--open', 'Open the default browser. ')
  .option('--env <env>', 'Change the value of the global variable ENV. ')
  .action((cmd) => {
    const NODE_ENV = 'development';
    const useHttps = cmd.https || defaluts.https;
    const host = cmd.host || defaluts.host;
    const port = cmd.port || defaluts.port;
    const url = `http${useHttps ? 's' : ''}://${host}:${port}`;
    const env = cmd.env || 'development';
    const devConfig = generateWebpackConfig(NODE_ENV, { url, env });
    const options = {
      compress: true,
      noInfo: true,
      hot: true,
      https: useHttps,
      useLocalIp: true,
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: appConfig.proxy || {},
    };

    process.env.NODE_ENV = NODE_ENV;

    const compiler = webpack(devConfig);
    const server = new WebpackDevServer(compiler, options);

    server.listen(port, host, () => {
      console.log();
      console.log(chalk.green('  Server starts successfully!'));
      console.log();
      console.log(`  Project is running at: ${chalk.cyan(url)}`);
      console.log();

      if (cmd.open) {
        open(url);
      }
    });
  });

program
  .command('build')
  .option('-R, --no-root', 'Build app under project directory.')
  .option('-n, --project-name [name]', 'Change project name. (defalut: field `name` in tuntuntutu.config.js)')
  .option('--cdn <cdn>', 'Access static files via cdn.')
  .option('--env <env>', 'Change the value of the global variable ENV. ')
  .action((cmd) => {
    const NODE_ENV = 'production';
    const projectName = cmd.projectName || appConfig.name;
    const env = cmd.env || 'production';
    const prodConfig = generateWebpackConfig(NODE_ENV, { env });

    if (!cmd.root) {
      prodConfig.output.publicPath = `/${projectName}/`;
    }

    if (cmd.cdn) {
      prodConfig.output.publicPath = `${cmd.cdn}${prodConfig.output.publicPath}`;
    }

    process.env.NODE_ENV = NODE_ENV;

    const compiler = webpack(prodConfig);

    new webpack.ProgressPlugin().apply(compiler);
    compiler.run((err, stats) => {
      if (err) {
        console.log(chalk.red('Build faild.'));
        console.log(err);
        process.exit(1);
      }

      if (stats.hasErrors()) {
        console.log(chalk.red('Build faild.'));
        console.log(stats.toString({
          chunks: false,
          colors: true,
          modules: false,
        }));
        process.exit(1);
      }

      console.log(chalk.green('  Build complete.'));
    });
  });

program.parse(process.argv);
