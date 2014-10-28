export function createModule(Constructor, name, description, callbacks) {
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