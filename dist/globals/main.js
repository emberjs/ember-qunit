!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.emq=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = function isolatedContainer(fullNames) {
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
},{"./test-resolver":6}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var isolatedContainer = _dereq_("./isolated-container")["default"] || _dereq_("./isolated-container");
var moduleFor = _dereq_("./module-for")["default"] || _dereq_("./module-for");
var moduleForComponent = _dereq_("./module-for-component")["default"] || _dereq_("./module-for-component");
var test = _dereq_("./test")["default"] || _dereq_("./test");
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");

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

exports.globalize = globalize;
exports.moduleFor = moduleFor;
exports.moduleForComponent = moduleForComponent;
exports.test = test;
exports.setResolver = setResolver;
},{"./isolated-container":1,"./module-for":4,"./module-for-component":3,"./test":7,"./test-resolver":6}],3:[function(_dereq_,module,exports){
"use strict";
var testResolver = _dereq_("./test-resolver")["default"] || _dereq_("./test-resolver");
var Ember = window.Ember["default"] || window.Ember;

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
},{"./test-resolver":6}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var QUnit = window.QUnit["default"] || window.QUnit;
var testContext = _dereq_("./test-context")["default"] || _dereq_("./test-context");
var isolatedContainer = _dereq_("./isolated-container")["default"] || _dereq_("./isolated-container");

exports["default"] = function moduleFor(fullName, description, callbacks, delegate) {
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
},{"./isolated-container":1,"./test-context":5}],5:[function(_dereq_,module,exports){
"use strict";
var __test_context__;

function set(context) {
  __test_context__ = context;
}

exports.set = set;function get() {
  return __test_context__;
}

exports.get = get;
},{}],6:[function(_dereq_,module,exports){
"use strict";
var __resolver__;

function set(resolver) {
  __resolver__ = resolver;
}

exports.set = set;function get() {
  if (__resolver__ == null) throw new Error('you must set a resolver with `testResolver.set(resolver)`');
  return __resolver__;
}

exports.get = get;
},{}],7:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var QUnit = window.QUnit["default"] || window.QUnit;
var testContext = _dereq_("./test-context")["default"] || _dereq_("./test-context");

function resetViews() {
  Ember.View.views = {};
}

exports["default"] = function test(testName, callback) {
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
},{"./test-context":5}]},{},[2])
(2)
});