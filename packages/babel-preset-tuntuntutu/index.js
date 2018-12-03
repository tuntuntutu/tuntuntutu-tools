module.exports = () => {
  const { getConfig } = require('tuntuntutu-utils');
  const appConfig = getConfig();
  const importAntd = [require('babel-plugin-import').default, {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }];
  const hmr = [require('babel-plugin-react-transform').default, {
    transforms: [{
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module'],
    }],
  }];

  return {
    presets: [
      [require('babel-preset-env').default, {
        modules: false,
      }],
      require('babel-preset-react'),
    ],
    plugins: [
      [require('babel-plugin-transform-object-rest-spread'), {
        useBuiltIns: true,
      }],
      require('babel-plugin-transform-decorators-legacy').default,
      require('babel-plugin-transform-class-properties'),
      require('babel-plugin-syntax-dynamic-import'),
      appConfig.platform === 'pc' ? importAntd : null,
      process.env.NODE_ENV === 'development' ? hmr : null,
    ].filter(Boolean),
  };
};
