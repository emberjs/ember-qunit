function normalizeCallbacks(callbacks) {
  if (typeof callbacks !== 'object') { return; }
  if (!callbacks) { return; }

  if (callbacks.beforeEach) {
    callbacks.setup = callbacks.beforeEach;
    delete callbacks.beforeEach;
  }

  if (callbacks.afterEach) {
    callbacks.teardown = callbacks.afterEach;
    delete callbacks.afterEach;
  }
}

export function createModule(Constructor, name, description, callbacks) {
  normalizeCallbacks(callbacks || description);

  var module = new Constructor(name, description, callbacks);

  QUnit.module(module.name, {
    setup: function() {
      module.setup();
    },
    teardown: function() {
      module.teardown();
    }
  });
}
