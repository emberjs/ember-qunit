import { module as qunitModule } from 'qunit';

function beforeEachCallback(callbacks) {
  if (typeof callbacks !== 'object') { return; }
  if (!callbacks) { return; }

  var beforeEach;
  
  if (callbacks.setup) {
    beforeEach = callbacks.setup;
    delete callbacks.setup;
  }

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

  if (callbacks.teardown) {
    afterEach = callbacks.teardown;
    delete callbacks.teardown;
  }

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
    setup: function(assert) {
      module.setup();

      if (beforeEach) {
        beforeEach.call(module.context, assert);
      }
    },

    teardown: function(assert) {
      if (afterEach) {
        afterEach.call(module.context, assert);
      }

      module.teardown();
    }
  });
}
