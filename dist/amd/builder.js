define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    function isolatedContainer(fullNames, resolver) {
      var container = new Ember.Container();
      container.optionsForType('component', { singleton: false });
      container.optionsForType('view', { singleton: false });
      container.optionsForType('template', { instantiate: false });
      container.optionsForType('helper', { instantiate: false });
      container.register('component-lookup:main', Ember.ComponentLookup);
      for (var i = fullNames.length; i > 0; i--) {
        var fullName = fullNames[i - 1];
        container.register(fullName, resolver.resolve(fullName));
      }
      return container;
    }

    function builder(fullName, needs, resolver) {
      var container = isolatedContainer([fullName].concat(needs || []), resolver);
      var factory = function() {
        return container.lookupFactory(fullName);
      };

      if (Ember.$('#ember-testing').length === 0) {
        Ember.$('<div id="ember-testing"/>').appendTo(document.body);
      }

      var result = {};
      result.container = container;
      result.factory = factory
      result.teardown = function(cb) {
        Ember.run(function(){
          container.destroy();
          if (result.dispatcher) {
            result.dispatcher.destroy();
          }
        });
        Ember.$('#ember-testing').empty();
      };
      return result;
    };

    function builderForModel(name, needs, resolver) {
      var result = builder('model:' + name, needs, resolver);

      if (DS._setupContainer) {
        DS._setupContainer(result.container);
      } else {
        result.container.register('store:main', DS.Store);
      }

      var adapterFactory = result.container.lookupFactory('adapter:application');
      if (!adapterFactory) {
        result.container.register('adapter:application', DS.FixtureAdapter);
      }

      result.teardown = function() {

      };

      result.store = function() {
        return result.container.lookup('store:main');
      };

      result.subject = function(options) {
        return Ember.run(function() {
          return result.container.lookup('store:main').createRecord(name, options);
        });
      };

      return result;
    }

    function builderForComponent(name, needs, resolver) {
      var result = builder('component:' + name, needs, resolver);
      var layoutName = 'template:components/' + name;
      var layout = resolver.resolve(layoutName);

      if (layout) {
        result.container.register(layoutName, layout);
        result.container.injection('component:' + name, 'layout', layoutName);
      }

      result.dispatcher = Ember.EventDispatcher.create();
      result.dispatcher.setup({}, '#ember-testing');

      result.append = function(subject) {
        return function(selector) {
          var containerView = Ember.ContainerView.create({container: result.container});
          var view = Ember.run(function(){
            if (typeof subject === "function") { subject = subject(); }
            containerView.pushObject(subject);
            // TODO: destory this somewhere
            containerView.appendTo('#ember-testing');
            return subject;
          });

          return view.$();
        };
      };

      return result;
    }

    __exports__.builder = builder;
    __exports__.builderForModel = builderForModel;
    __exports__.builderForComponent = builderForComponent;
  });