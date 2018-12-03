const path = require('path');

const DEV_PATH = path.resolve(process.cwd(), 'src');

module.exports = {
  extends: 'airbnb',
  plugins: [
    'react', 'import', 'jsx-a11y',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        resolve: {
          alias: {
            '@': DEV_PATH,
          },
        },
      },
    },
  },
  globals: {
    window: true,
    document: true,
    XMLHttpRequest: true,
    fetch: true,
    AMap: true,
    ENV: true,
  },
  rules: {
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'off',
    'no-console': 'off',
    'react/jsx-filename-extension': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'react/forbid-prop-types': 'off',
    'max-len': ['error', { code: 120 }],
    'react/prefer-stateless-function': 'off', // 只有render
    'react/jsx-first-prop-new-line': 'off', // 换行
    'react/sort-comp': 'off',
    'react/jsx-closing-tag-location': 'off',
    'import/extensions': 'off', // 扩展名
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-unused-expressions': 'off',
    'no-mixed-operators': 'off',
    'no-shadow': 'off',
    'react/prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/no-string-refs': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'newline-after-var': 1,
    'newline-before-return': 1,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
};
