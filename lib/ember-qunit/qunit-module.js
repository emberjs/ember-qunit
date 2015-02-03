export function createModule(Constructor, name, description, callbacks) {
  if (callbacks && callbacks.beforeEach) {
    callbacks.setup = callbacks.beforeEach;
    delete callbacks.beforeEach;
  }

  if (callbacks && callbacks.afterEach) {
    callbacks.teardown = callbacks.afterEach;
    delete callbacks.afterEach;
  }

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
