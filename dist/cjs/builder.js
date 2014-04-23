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
  return builder('model:' + name, needs);
}

function builderForComponent(name, needs) {
  return builder('component:' + name, needs);
}

exports.builder = builder;
exports.builderForModel = builderForModel;
exports.builderForComponent = builderForComponent;