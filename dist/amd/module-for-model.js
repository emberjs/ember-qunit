define(
  ["./module-for","ember","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;
    var qunitModule = __dependency1__.qunitModule;
    var builderForModel = __dependency3__.builderForModel;

    function delegate(name, container, context, defaultSubject) {
      if (DS._setupContainer) {
        DS._setupContainer(container);
      } else {
        container.register('store:main', DS.Store);
      }

      var adapterFactory = container.lookupFactory('adapter:application');
      if (!adapterFactory) {
        container.register('adapter:application', DS.FixtureAdapter);
      }

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
    }

    __exports__["default"] = function moduleForModel(name, description, callbacks) {
      // TODO: continue abstraction, make moduleForModel a simple assignment
      qunitModule(builderForModel, delegate.bind(null, name)).apply(null, arguments);
    }
  });