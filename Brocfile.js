var makeModules = require('broccoli-dist-es6-module');

module.exports = makeModules('lib', {
  global: 'emq',
  packageName: 'ember-qunit',
  main: 'main',
  shim: {
    'ember': 'Ember',
    'qunit': 'QUnit'
  }
});

