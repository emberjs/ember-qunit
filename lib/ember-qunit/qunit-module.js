import Ember from 'ember';
import { module as qunitModule } from 'qunit';

function noop() {}

function callbackFor(name, callbacks) {
  if (typeof callbacks !== 'object') { return noop; }
  if (!callbacks) { return noop; }

  var callback = noop;

  if (callbacks[name]) {
    callback = callbacks[name];
    delete callbacks[name];
  }

  return callback;
}

export function wrapCallbacks(Constructor, _name, _callbacks) {
  let callbacks = _callbacks;
  let name = _name;
  if (!callbacks && typeof name === 'object') {
    callbacks = name;
    name = '';
  }

  var before = callbackFor('before', callbacks);
  var beforeEach = callbackFor('beforeEach', callbacks);
  var afterEach  = callbackFor('afterEach', callbacks);
  var after  = callbackFor('after', callbacks);

  var module;
  var options = {};

  if (callbacks) {
    for (let key in callbacks) {
      options[key] = callbacks[key];
    }
  }

  options.before = function() {
    module = new Constructor(name || '', callbacks);

    if (before) {
      return before.apply(this, arguments);
    }
  };

  options.beforeEach = function() {
    // provide the test context to the underlying module
    module.setContext(this);

    return module.setup(...arguments).then(() => {
      if (beforeEach) {
        return beforeEach.apply(this, arguments);
      }
    });
  };

  options.afterEach = function() {
    let result;

    if (afterEach) {
      result = afterEach.apply(this, arguments);
    }

    return Ember.RSVP.resolve(result).then(() => module.teardown(...arguments));
  };

  options.after = function() {
    let result;

    if (before) {
      result = after.apply(this, arguments);
    }

    module = null;

    return result;
  };

  return options;
}

export function buildOptionsWrapperFactory(Constructor) {
  return function optionsWrapperFactory(name, callbacks) {
    return wrapCallbacks(Constructor, name, callbacks);
  };
}

export function createModule(Constructor, name, description, callbacks) {
  let options = wrapCallbacks(Constructor, name, callbacks || description);

  qunitModule(name, options);
}
