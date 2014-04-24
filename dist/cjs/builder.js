"use strict";
var Ember = require("ember")["default"] || require("ember");
var isolatedContainer = require("./isolated-container")["default"] || require("./isolated-container");

function builder(fullName, needs) {
  var container = isolatedContainer([fullName].concat(needs || []));
  var factory = function() {
    return container.lookupFactory(fullName);
  };
  return {
    container: container,
    factory: factory
  };
};

function builderForModel(name, needs) {
  var result = builder('model:' + name, needs);

  if (DS._setupContainer) {
    DS._setupContainer(result.container);
  } else {
    result.container.register('store:main', DS.Store);
  }

  var adapterFactory = result.container.lookupFactory('adapter:application');
  if (!adapterFactory) {
    result.container.register('adapter:application', DS.FixtureAdapter);
  }

  return result;
}

function builderForComponent(name, needs, resolver) {
  var result = builder('component:' + name, needs);
  var layoutName = 'template:components/' + name;
  var layout = resolver.resolve(layoutName);

  if (layout) {
    result.container.register(layoutName, layout);
    result.container.injection('component:' + name, 'layout', layoutName);
  }

  return result;
}

exports.builder = builder;
exports.builderForModel = builderForModel;
exports.builderForComponent = builderForComponent;