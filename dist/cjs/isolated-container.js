"use strict";
var testResolver = require("./test-resolver")["default"] || require("./test-resolver");
var Ember = require("ember")["default"] || require("ember");

exports["default"] = function isolatedContainer(fullNames) {
  var resolver = testResolver.get();
  var container = new Ember.Container();
  var normalize = function(fullName) {
    return resolver.normalize(fullName);
  };
  if (Ember.typeOf(container.normalizeFullName) === 'function') {
    container.normalizeFullName = normalize;
  } else {
    container.normalize = normalize;
  }
  container.optionsForType('component', { singleton: false });
  container.optionsForType('view', { singleton: false });
  container.optionsForType('template', { instantiate: false });
  container.optionsForType('helper', { instantiate: false });
  container.register('component-lookup:main', Ember.ComponentLookup);
  for (var i = fullNames.length; i > 0; i--) {
    var fullName = fullNames[i - 1];
    var normalizedFullName = resolver.normalize(fullName);
    container.register(fullName, resolver.resolve(normalizedFullName));
  }
  return container;
}