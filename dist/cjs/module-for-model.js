"use strict";
var moduleFor = require("./module-for")["default"] || require("./module-for");
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-for").qunitModule;
var builderForModel = require("./builder").builderForModel;

exports["default"] = qunitModule(builderForModel, function(fullName, container, context, defaultSubject, products) {
  context.__setup_properties__.store = products.store;
  if (context.__setup_properties__.subject === defaultSubject) {
    context.__setup_properties__.subject = products.subject;
  }
});