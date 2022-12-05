'use strict';

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    requireConfigFile: false, // allow @babel/eslint-parser to run on files that do not have a Babel configuration associated with them
  },
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.prettierrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'tests/dummy/app/**',
        'vendor/**',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },

    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/method-signature-style': 'error',
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/no-redundant-type-constituents': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-readonly-parameter-types': 'error',
        '@typescript-eslint/promise-function-async': 'error',
      },
    },

    // test files
    {
      files: ['tests/**/*.js'],
      env: {
        qunit: true,
      },
    },

    // ensure we do not accidentally land async/await in shipped addon-test-support
    {
      files: ['addon-test-support/**/*.js'],
      plugins: ['disable-features'],
      rules: {
        'disable-features/disable-async-await': 'error',
        'disable-features/disable-generator-functions': 'error',
      },
    },
  ],
};
