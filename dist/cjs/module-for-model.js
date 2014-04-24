"use strict";
var moduleFor = require("./module-for")["default"] || require("./module-for");
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-for").qunitModule;
var builderForModel = require("./builder").builderForModel;

exports["default"] = qunitModule(builderForModel, function(fullName, container, context, defaultSubject) {
  var name = fullName.split(':', 2).pop();

  context.__setup_properties__.store = function(){
    return container.lookup('store:main');
  };

  if (context.__setup_properties__.subject === defaultSubject) {
    context.__setup_properties__.subject = function(options) {
      return Ember.run(function() {
        return container.lookup('store:main').createRecord(name, options);
      });
    };
  }
});