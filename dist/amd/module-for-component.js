define(
  ["./module-for","ember","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;
    var qunitModule = __dependency1__.qunitModule;
    var builderForComponent = __dependency3__.builderForComponent;

    __exports__["default"] = qunitModule(builderForComponent, function(fullName, container, context, defaultSubject) {
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
    });
  });