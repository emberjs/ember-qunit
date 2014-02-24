var makeES6Module = require('broccoli-dist-es6-module');

module.exports = function(broccoli) {
  return makeES6Module(broccoli.makeTree('lib'), {
    global: 'window',
    imports: {
      'ember': 'Ember'
    }
  });
};


