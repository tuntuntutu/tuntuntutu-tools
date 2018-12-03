const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HappyPack = require('happypack');

const ROOT_PATH = path.resolve(process.cwd());
const DEV_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    path.resolve(DEV_PATH, 'index.js'),
  ],

  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      '@': DEV_PATH,
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['happypack/loader?id=js'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: false } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              paths: [
                path.resolve(ROOT_PATH, 'node_modules'),
                DEV_PATH,
              ],
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: [
          'url-loader?limit=4096&name=assets/images/[hash:8].[name].[ext]',
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|otf)$/,
        use: [
          'url-loader?limit=4096',
        ],
      },
      {
        test: /\.(wav|mp3|mp4)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(DEV_PATH, 'templates/index.html'),
    }),

    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: ['babel-loader'],
    }),

    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),

  ],
};
