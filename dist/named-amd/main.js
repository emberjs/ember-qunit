define("ember-qunit/isolated-container",
  ["./test-resolver","ember","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var testResolver = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = function isolatedContainer(fullNames) {
      var resolver = testResolver.get();
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
  });define("ember-qunit",
  ["ember","./isolated-container","./module-for","./module-for-component","./test","./test-resolver","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var isolatedContainer = __dependency2__["default"] || __dependency2__;
    var moduleFor = __dependency3__["default"] || __dependency3__;
    var moduleForComponent = __dependency4__["default"] || __dependency4__;
    var test = __dependency5__["default"] || __dependency5__;
    var testResolver = __dependency6__["default"] || __dependency6__;

    Ember.testing = true;

    function setResolver(resolver) {
      testResolver.set(resolver);
    }

    function globalize() {
      window.moduleFor = moduleFor;
      window.moduleForComponent = moduleForComponent;
      window.test = test;
      window.setResolver = setResolver;
    }

    __exports__.globalize = globalize;
    __exports__.moduleFor = moduleFor;
    __exports__.moduleForComponent = moduleForComponent;
    __exports__.test = test;
    __exports__.setResolver = setResolver;
  });define("ember-qunit/module-for-component",
  ["./test-resolver","ember","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var testResolver = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = function moduleForComponent(name, description, callbacks) {
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
  });define("ember-qunit/module-for-model",
  [],
  function() {
    "use strict";
    // TODO
    //function moduleForModel(name, description, callbacks) {
      //moduleFor('model:' + name, description, callbacks, function(container, context) {
        //// custom model specific awesomeness
        //container.register('store:main', DS.Store);
        //container.register('adapter:application', DS.FixtureAdapter);

        //context.__setup_properties__.store = function(){
          //return container.lookup('store:main');
        //};

        //if (context.__setup_properties__.subject === defaultSubject) {
          //context.__setup_properties__.subject = function(factory, options) {
            //return Ember.run(function() {
              //return container.lookup('store:main').createRecord(name, options);
            //});
          //};
        //}
      //});
    //}
  });define("ember-qunit/module-for",
  ["ember","qunit","./test-context","./isolated-container","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var QUnit = __dependency2__["default"] || __dependency2__;
    var testContext = __dependency3__["default"] || __dependency3__;
    var isolatedContainer = __dependency4__["default"] || __dependency4__;

    __exports__["default"] = function moduleFor(fullName, description, callbacks, delegate) {
      callbacks = callbacks || { };

      var needs = [fullName].concat(callbacks.needs || []);
      var container = isolatedContainer(needs);

      callbacks.subject = callbacks.subject || defaultSubject;

      callbacks.setup    = callbacks.setup    || function() { };
      callbacks.teardown = callbacks.teardown || function() { };

      function factory() {
        return container.lookupFactory(fullName);
      }

      function subject(options) {
        return callbacks.subject(factory(), options);
      }

      testContext.set({
        container: container,
        subject: subject,
        factory: factory,
        __setup_properties__: callbacks
      });

      if (delegate) {
        delegate(container, testContext.get());
      }

      var context = testContext.get();
      // TODO: move this to component|view callbacks when infrastructure is added
      // to make it simpler
      var dispatcher = Ember.EventDispatcher.create();
      var _callbacks = {
        setup: function(){
          dispatcher.setup();
          Ember.$('<div id="ember-testing"/>').appendTo(document.body);
          buildContextVariables(context);
          callbacks.setup.call(context, container);
        },

        teardown: function(){
          Ember.run(function(){
            container.destroy();
            dispatcher.destroy();
          });
          Ember.$('#ember-testing').empty();
          callbacks.teardown(container);
        }
      };

      QUnit.module(description || fullName, _callbacks);
    }

    function defaultSubject(factory, options) {
      return factory.create(options);
    }

    // allow arbitrary named factories, like rspec let
    function buildContextVariables(context) {
      var cache = { };
      var callbacks = context.__setup_properties__;
      var factory = context.factory;
      var container = context.container;

      Ember.keys(callbacks).filter(function(key){
        // ignore the default setup/teardown keys
        return key !== 'setup' && key !== 'teardown';
      }).forEach(function(key){
        context[key] = function(options) {
          if (cache[key]) {
            return cache[key];
          }

          var result = callbacks[key](factory(), options, container);
          cache[key] = result;
          return result;
        };
      });
    }
  });define("ember-qunit/test-context",
  ["exports"],
  function(__exports__) {
    "use strict";
    var __test_context__;

    function set(context) {
      __test_context__ = context;
    }

    __exports__.set = set;function get() {
      return __test_context__;
    }

    __exports__.get = get;
  });define("ember-qunit/test-resolver",
  ["exports"],
  function(__exports__) {
    "use strict";
    var __resolver__;

    function set(resolver) {
      __resolver__ = resolver;
    }

    __exports__.set = set;function get() {
      if (__resolver__ == null) throw new Error('you must set a resolver with `testResolver.set(resolver)`');
      return __resolver__;
    }

    __exports__.get = get;
  });define("ember-qunit/test",
  ["ember","qunit","./test-context","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var QUnit = __dependency2__["default"] || __dependency2__;
    var testContext = __dependency3__["default"] || __dependency3__;

    function resetViews() {
      Ember.View.views = {};
    }

    __exports__["default"] = function test(testName, callback) {
      var context = testContext.get(); // save refence

      function wrapper() {
        resetViews();
        var result = callback.call(context);

        function failTestOnPromiseRejection(reason) {
          ok(false, reason);
        }

        Ember.run(function(){
          stop();
          Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
        });
      }

      QUnit.test(testName, wrapper);
    }
  });