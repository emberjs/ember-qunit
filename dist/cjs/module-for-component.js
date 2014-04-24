"use strict";
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-for").qunitModule;
var builderForComponent = require("./builder").builderForComponent;

exports["default"] = qunitModule(builderForComponent, function(products, context) {
  context.dispatcher = products.dispatcher;
  context.__setup_properties__.append = products.append(function() { return context.subject() });
  context.__setup_properties__.$ = context.__setup_properties__.append;
});