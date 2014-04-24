"use strict";
var moduleFor = require("./module-for")["default"] || require("./module-for");
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-for").qunitModule;
var builderForModel = require("./builder").builderForModel;

exports["default"] = qunitModule(builderForModel, function(products, context, options) {
  context.__setup_properties__.store = products.store;
  context.__setup_properties__.subject = options.subjectIsDefault ?
    products.subject : context.__setup_properties__.subject;
});