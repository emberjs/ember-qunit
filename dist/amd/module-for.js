define(
  ["ember","./test-context","./test-resolver","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    //import QUnit from 'qunit'; // Assumed global in runner
    var testContext = __dependency2__["default"] || __dependency2__;
    var testResolver = __dependency3__["default"] || __dependency3__;

    var builder = __dependency4__.builder;

    function qunitModule(builder, delegate) {
      return function moduleFor(fullName, description, callbacks) {
        var products;
        var context;
        
        var _callbacks = {
          setup: function(){
            callbacks = callbacks || { };
            callbacks.subject   = callbacks.subject || defaultSubject;

            callbacks.setup     = callbacks.setup    || function() { };
            callbacks.teardown  = callbacks.teardown || function() { };
            
            products = builder(fullName, callbacks.needs, testResolver.get());

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
            
            if (Ember.$('#ember-testing').length === 0) {
              Ember.$('<div id="ember-testing"/>').appendTo(document.body);
            }
            
            buildContextVariables(context);
            callbacks.setup.call(context, products.container);
          },

          teardown: function(){
            Ember.run(function(){
              products.container.destroy();
              
              if (context.dispatcher) {
                context.dispatcher.destroy();
              }
            });
            
            callbacks.teardown(products.container);
            Ember.$('#ember-testing').empty();
          }
        };

        QUnit.module(description || fullName, _callbacks);
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
    }

    __exports__["default"] = qunitModule(builder, null);
    __exports__.builder = builder;
    __exports__.qunitModule = qunitModule;
  });