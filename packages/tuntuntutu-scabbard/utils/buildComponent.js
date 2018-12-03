const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const postcss = require('rollup-plugin-postcss');
const image = require('rollup-plugin-image');
const autoprefixer = require('autoprefixer');

const ROOT_PATH = path.resolve(process.cwd());
const input = './src/index.js';
const outputFolder = './dist';
const pkg = require(`${ROOT_PATH}/package.json`);

exports.buildComponent = async () => {
  const plugins = [];

  plugins.push(autoprefixer);
  // if (appConfig.target === 'mobile') {
  //   plugins.push(px2viewport({ viewportWidth: appConfig.viewportWidth || 375 }));
  // }

  const inputOption = {
    input,
    plugins: [
      postcss({
        plugins,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      image(),
    ],
    external: Object.keys(pkg.dependencies || {}),
  };
  const outputOption = {
    file: `${outputFolder}/index.js`,
    format: 'cjs',
  };

  const bundle = await rollup.rollup(inputOption);

  await bundle.write(outputOption);
};
