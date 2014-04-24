"use strict";
var Ember = require("ember")["default"] || require("ember");
//import QUnit from 'qunit'; // Assumed global in runner
var testContext = require("./test-context")["default"] || require("./test-context");

exports["default"] = function qunitModule(builder, delegate) {
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