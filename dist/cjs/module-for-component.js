"use strict";
var moduleFor = require("./module-for")["default"] || require("./module-for");
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-for").qunitModule;
var builderForComponent = require("./builder").builderForComponent;


function delegate(fullName, container, context, defaultSubject, resolver) {
  var name = fullName.split(':', 2).pop();
  var layoutName = 'template:components/' + name;

  var layout = resolver.resolve(layoutName);

  if (layout) {
    container.register(layoutName, layout);
    container.injection('component:' + name, 'layout', layoutName);
  }

  context.dispatcher = Ember.EventDispatcher.create();
  context.dispatcher.setup({}, '#ember-testing');

  context.__setup_properties__.append = function(selector) {
    var containerView = Ember.ContainerView.create({container: container});
    var view = Ember.run(function(){
      var subject = context.subject();
      containerView.pushObject(subject);
      // TODO: destory this somewhere
      containerView.appendTo('#ember-testing');
      return subject;
    });

    return view.$();
  };
  context.__setup_properties__.$ = context.__setup_properties__.append;
}

exports["default"] = qunitModule(builderForComponent, delegate);