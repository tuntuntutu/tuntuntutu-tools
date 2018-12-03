const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getConfig } = require('tuntuntutu-utils');

const ROOT_PATH = path.resolve(process.cwd());
const DEV_PATH = path.resolve(ROOT_PATH, 'src');
const appConfig = getConfig();
const common = require('../config/webpack.common');
const theme = require('../config/theme');

const pkg = require(`${ROOT_PATH}/package.json`);
const commonPkgs = Object.keys(pkg.dependencies);
let commonRegExp;

if (commonPkgs.length > 0) {
  if (commonPkgs.includes('antd')) {
    commonPkgs.push('rc-');
  }
  commonRegExp = new RegExp(commonPkgs.join('|'));
}

exports.generateWebpackConfig = (mode, opts = {}) => {
  const options = { ...appConfig, ...opts };
  const {
    platform, extraWebpackPlugins, env,
  } = options;

  let plugins = [
    new webpack.DefinePlugin({
      ENV: JSON.stringify(env),
    }),
  ];

  if (extraWebpackPlugins && !Array.isArray(extraWebpackPlugins)) {
    console.log();
    console.log(chalk.red('Error: "extraWebpackPlugins" should be an array in tuntuntutu.config.js'));
    process.exit(1);
  }

  if (Array.isArray(extraWebpackPlugins)) {
    plugins = plugins.concat(extraWebpackPlugins);
  }

  let config = merge(common, {
    mode,
    plugins,
  });

  if (commonRegExp) {
    config.optimization = merge.smart(config.optimization, {
      splitChunks: {
        cacheGroups: {
          common: {
            name: 'common',
            test: commonRegExp || '',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    });
  }

  // 自定义主题
  if (platform === 'pc') {
    config.module = merge.smart(config.module, {
      rules: [{
        test: /\.less$/,
        use: [{
          loader: 'less-loader',
          options: {
            modifyVars: { ...theme, ...options.theme },
          },
        }],
      }],
    });
  }

  if (mode === 'development') {
    config = merge.strategy({
      entry: 'prepend',
    })(config, {
      devtool: 'inline-source-map',
      entry: [
        `webpack-dev-server/client?${options.url}`,
      ],
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
      ],
    });
  }

  if (mode === 'production') {
    const cssLoader = {
      loader: 'css-loader',
      options: {
        minimize: true,
      },
    };

    // replace style-loader by MiniCssExtractPlugin.loader
    config.module.rules.forEach((rule) => {
      const testStr = rule.test.toString();
      if (testStr === /\.css$/.toString() || testStr === /\.less$/.toString()) {
        /* eslint-disable-next-line no-param-reassign */
        rule.use[0] = MiniCssExtractPlugin.loader;
      }
    });

    config.module = merge.smart(config.module, {
      rules: [{
        test: /\.css$/,
        use: [cssLoader],
      }, {
        test: /\.less$/,
        use: [cssLoader],
      }],
    });

    const entry = {
      main: path.resolve(DEV_PATH, 'index.js'),
    };


    config = merge.strategy({
      entry: 'replace',
    })(config, {
      devtool: false,
      entry,
      output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
      },
      plugins: [
        new CleanWebpackPlugin(['build'], {
          root: ROOT_PATH, // An absolute path for the root  of webpack.rule.js
          verbose: false, // Write logs to console.
          dry: false, // Do not delete anything, good for testing.
        }),

        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].css',
        }),

      ].filter(Boolean),
    });
  }

  return config;
};
