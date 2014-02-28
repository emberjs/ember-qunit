"use strict";
var testResolver = require("./test-resolver")["default"] || require("./test-resolver");
var Ember = require("ember")["default"] || require("ember");

exports["default"] = function moduleForComponent(name, description, callbacks) {
  var resolver = testResolver.get();

  moduleFor('component:' + name, description, callbacks, function(container, context) {
    var templateName = 'template:components/' + name;

    var template = resolver.resolve(templateName);

    if (template) {
      container.register(templateName, template);
      container.injection('component:' + name, 'template', templateName);
    }

    context.__setup_properties__.append = function(selector) {
      var containerView = Ember.ContainerView.create({container: container});
      var view = Ember.run(function(){
        var subject = context.subject();
        containerView.pushObject(subject);
        // TODO: destory this somewhere
        containerView.appendTo(Ember.$('#ember-testing')[0]);
        return subject;
      });

      return view.$();
    };
    context.__setup_properties__.$ = context.__setup_properties__.append;
  });
}