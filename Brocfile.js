module.exports = function(broccoli) {
  return require('broccoli-dist-es6-module')(broccoli.makeTree('lib'), {
    global: 'window',
    imports: {
      'ember': 'Ember'
    }
  });
};

