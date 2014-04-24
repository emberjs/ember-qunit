"use strict";
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-base")["default"] || require("./module-base");
var builderForModel = require("./builder").builderForModel;

exports["default"] = qunitModule(builderForModel, function(products, context, options) {
  context.__setup_properties__.store = products.store;
  context.__setup_properties__.subject = options.subjectIsDefault ?
    products.subject : context.__setup_properties__.subject;
});