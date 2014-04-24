"use strict";
var Ember = require("ember")["default"] || require("ember");
//import QUnit from 'qunit'; // Assumed global in runner
var testContext = require("./test-context")["default"] || require("./test-context");
var testResolver = require("./test-resolver")["default"] || require("./test-resolver");
var isolatedContainer = require("./isolated-container")["default"] || require("./isolated-container");

var builder = require("./builder").builder;

function qunitModule(builder, delegate) {
  return function moduleFor(fullName, description, callbacks, delegate) {
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
          delegate(products.container, context, defaultSubject, testResolver.get());
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

exports["default"] = qunitModule(builder, null);
exports.builder = builder;
exports.qunitModule = qunitModule;