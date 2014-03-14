define(
  ["./test-resolver","./module-for","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var testResolver = __dependency1__["default"] || __dependency1__;
    var moduleFor = __dependency2__["default"] || __dependency2__;
    var Ember = __dependency3__["default"] || __dependency3__;

    var originalHelper;

    __exports__["default"] = function moduleForHelper(name, description, callbacks) {
      var resolver = testResolver.get();

      if (!callbacks) { callbacks = {} };

      var _callbacks = {
        setup: function(container){
          var helper = resolver.resolve('helper:' + name)
          originalHelper = Ember.Handlebars.helpers[name];

          Ember.Handlebars.helper(name, helper);

          if (typeof callbacks.setup === 'function') {
            callbacks.setup(container);        
          }
        },

        teardown: function(container){
          Ember.Handlebars.helpers[name] = originalHelper;
          if (typeof callbacks.teardown === 'function') {
            callbacks.teardown(container);
          }
        }
      };

      moduleFor('helper:' + name, description, _callbacks, function(container, context) {
        context.__setup_properties__.append = function(selector) {
          var containerView = Ember.ContainerView.create({container: container});
          var view = Ember.run(function(){
            var subject = context.subject();
            containerView.pushObject(subject);
            containerView.appendTo(Ember.$('#ember-testing')[0]);
            return subject;
          });

          return view.$();
        };

        context.__setup_properties__.subject = function(helper, options){
          var template = options.template;
          var context = options.context;

          if (!context) { context = {}; }
          var View = Ember.View.extend({
            controller: context,
            template: Ember.Handlebars.compile(template)
          });
          return View.create();
        };

        context.__setup_properties__.$ = context.__setup_properties__.append;
      });
    };
  });