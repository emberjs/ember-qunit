import Ember from 'ember';
import { module as qunitModule } from 'qunit';

function beforeEachCallback(callbacks) {
  if (typeof callbacks !== 'object') { return; }
  if (!callbacks) { return; }

  var beforeEach;

  if (callbacks.beforeEach) {
    beforeEach = callbacks.beforeEach;
    delete callbacks.beforeEach;
  }

  return beforeEach;
}

function afterEachCallback(callbacks) {
  if (typeof callbacks !== 'object') { return; }
  if (!callbacks) { return; }

  var afterEach;

  if (callbacks.afterEach) {
    afterEach = callbacks.afterEach;
    delete callbacks.afterEach;
  }

  return afterEach;
}

export function createModule(Constructor, name, description, callbacks) {
  var beforeEach = beforeEachCallback(callbacks || description);
  var afterEach  = afterEachCallback(callbacks || description);

  var module = new Constructor(name, description, callbacks);

  qunitModule(module.name, {
    beforeEach() {
      // provide the test context to the underlying module
      module.setContext(this);

      return module.setup(...arguments).then(() => {
        if (beforeEach) {
          return beforeEach.apply(this, arguments);
        }
      });
    },

    afterEach() {
      let result;

      if (afterEach) {
        result = afterEach.apply(this, arguments);
      }

      return Ember.RSVP.resolve(result).then(() => module.teardown(...arguments));
    }
  });
}
