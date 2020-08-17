'use strict';

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    {
      files: [
        './index.js',
        './.eslintrc.js',
        './.prettierrc.js',
        './config/ember-try.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
    },
    {
      files: ['tests/**/*.js'],
      env: {
        qunit: true,
      },
    },
    {
      files: ['./index.js', 'addon-test-support/**/*.js'],
      plugins: ['disable-features'],
      rules: {
        'disable-features/disable-async-await': 'error',
        'disable-features/disable-generator-functions': 'error',
      },
    },
  ],
};
