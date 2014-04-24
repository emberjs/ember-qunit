define("ember-qunit/builder",
  ["ember","./test-resolver","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var testResolver = __dependency2__["default"] || __dependency2__;

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

    function builder(fullName, needs) {
      var resolver = testResolver.get();
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

    function builderForModel(name, needs) {
      var result = builder('model:' + name, needs);

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

    function builderForComponent(name, needs) {
      var resolver = testResolver.get();
      var result = builder('component:' + name, needs);
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
  });define("ember-qunit",
  ["ember","./module-for","./module-for-component","./module-for-model","./test","./test-resolver","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var moduleFor = __dependency2__["default"] || __dependency2__;
    var moduleForComponent = __dependency3__["default"] || __dependency3__;
    var moduleForModel = __dependency4__["default"] || __dependency4__;
    var test = __dependency5__["default"] || __dependency5__;
    var testResolver = __dependency6__["default"] || __dependency6__;

    Ember.testing = true;

    function setResolver(resolver) {
      testResolver.set(resolver);
    }

    function globalize() {
      window.moduleFor = moduleFor;
      window.moduleForComponent = moduleForComponent;
      window.moduleForModel = moduleForModel;
      window.test = test;
      window.setResolver = setResolver;
    }

    __exports__.globalize = globalize;
    __exports__.moduleFor = moduleFor;
    __exports__.moduleForComponent = moduleForComponent;
    __exports__.moduleForModel = moduleForModel;
    __exports__.test = test;
    __exports__.setResolver = setResolver;
  });define("ember-qunit/module-base",
  ["ember","./test-context","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    //import QUnit from 'qunit'; // Assumed global in runner
    var testContext = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = function qunitModule(builder, delegate) {
      return function moduleFor(fullName, description, callbacks) {
        var products;
        var context;
        
        var _callbacks = {
          setup: function(){
            callbacks = callbacks || { };
            callbacks.subject   = callbacks.subject || defaultSubject;

            callbacks.setup     = callbacks.setup    || function() { };
            callbacks.teardown  = callbacks.teardown || function() { };
            
            products = builder(fullName, callbacks.needs);

            testContext.set({
              container:            products.container,
              factory:              products.factory,
              dispatcher:           null,
              __setup_properties__: callbacks
            });
            
            context = testContext.get();

            if (delegate) {
              delegate(products, context, {
                subjectIsDefault: (context.__setup_properties__.subject === defaultSubject)
              });
            }
            
            buildContextVariables(context);
            callbacks.setup.call(context, products.container);
          },

          teardown: function(){
            products.teardown();
            callbacks.teardown(products.container);
          }
        };

        QUnit.module(description || fullName, _callbacks);
      }
    }

    function defaultSubject(options, factory) {
      return factory.create(options);
    }

    // allow arbitrary named factories, like rspec let
    function buildContextVariables(context) {
      var cache     = { };
      var callbacks = context.__setup_properties__;
      var container = context.container;
      var factory   = context.factory;
        
      Ember.keys(callbacks).filter(function(key){
        // ignore the default setup/teardown keys
        return key !== 'setup' && key !== 'teardown';
      }).forEach(function(key){
        context[key] = function(options) {
          if (cache[key]) { return cache[key]; }

          var result = callbacks[key](options, factory(), container);
          cache[key] = result;
          return result;
        };
      });
    }
  });define("ember-qunit/module-for-component",
  ["ember","./module-base","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__["default"] || __dependency2__;
    var builderForComponent = __dependency3__.builderForComponent;

    __exports__["default"] = qunitModule(builderForComponent, function(products, context) {
      context.dispatcher = products.dispatcher;
      context.__setup_properties__.append = products.append(function() { return context.subject() });
      context.__setup_properties__.$ = context.__setup_properties__.append;
    });
  });define("ember-qunit/module-for-model",
  ["ember","./module-base","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__["default"] || __dependency2__;
    var builderForModel = __dependency3__.builderForModel;

    __exports__["default"] = qunitModule(builderForModel, function(products, context, options) {
      context.__setup_properties__.store = products.store;
      context.__setup_properties__.subject = options.subjectIsDefault ?
        products.subject : context.__setup_properties__.subject;
    });
  });define("ember-qunit/module-for",
  ["ember","./module-base","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__["default"] || __dependency2__;
    var builder = __dependency3__.builder;

    __exports__["default"] = qunitModule(builder, null);
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
  ["ember","./test-context","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    //import QUnit from 'qunit'; // Assumed global in runner
    var testContext = __dependency2__["default"] || __dependency2__;

    function resetViews() {
      Ember.View.views = {};
    }

    __exports__["default"] = function test(testName, callback) {

      function wrapper() {
        var context = testContext.get();
        
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