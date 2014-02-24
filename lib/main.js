// TODO:
// - need to check signature in all moduleFor* methods

import Ember from 'ember';

Ember.testing = true;

var __testing_context__;
var __resolver__;

function setResolver(resolver) {
  __resolver__ = resolver
}

function isolatedContainer(fullNames) {
  var container = new Ember.Container();
  container.optionsForType('component', { singleton: false });
  container.optionsForType('view', { singleton: false });
  container.optionsForType('template', { instantiate: false });
  container.optionsForType('helper', { instantiate: false });
  container.register('component-lookup:main', Ember.ComponentLookup);
  for (var i = fullNames.length; i > 0; i--) {
    var fullName = fullNames[i - 1];
    container.register(fullName, __resolver__.resolve(fullName));
  }
  return container;
}

function defaultSubject(factory, options) {
  return factory.create(options);
}

function moduleFor(fullName, description, callbacks, delegate) {
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

  __testing_context__ = {
    container: container,
    subject: subject,
    factory: factory,
    __setup_properties__: callbacks
  };

  if (delegate) {
    delegate(container, __testing_context__);
  }

  var context = __testing_context__;
  var _callbacks = {
    setup: function(){
      Ember.$('<div id="ember-testing"/>').appendTo(document.body);
      buildContextVariables(context);
      callbacks.setup.call(context, container);
    },

    teardown: function(){
      Ember.run(function(){
        container.destroy();
      });
      Ember.$('#ember-testing').empty();
      callbacks.teardown(container);
    }
  };

  module(description || fullName, _callbacks);
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

function resetViews() {
  Ember.View.views = {};
}

function test(testName, callback) {
  var context = __testing_context__; // save refence

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

// TODO
//function moduleForView(name, description, callbacks) {
//}

function moduleForComponent(name, description, callbacks) {
  moduleFor('component:' + name, description, callbacks, function(container, context) {
    var templateName = 'template:components/' + name;

    var template = __resolver__.resolve(templateName);

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

function moduleForController(name, description, callbacks) {
  moduleFor('controller:'+name, description, callbacks);
}

function moduleForRoute(name, description, callbacks) {
  moduleFor('route:'+name, description, callbacks);
}

export {
  isolatedContainer,
  moduleFor,
  moduleForComponent,
  moduleForController,
  moduleForRoute,
  //moduleForModel,
  setResolver,
  test
};

