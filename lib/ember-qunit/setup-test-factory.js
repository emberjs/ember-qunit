export default function(Constructor) {
  return function setupTest(hooks, options) {
    let module;

    hooks.before(function() {
      // TODO: should we actually have this in the API
      module = new Constructor('', options);
    });

    hooks.beforeEach(function() {
      module.setContext(this);

      return module.setup(...arguments);
    });

    hooks.afterEach(function() {
      return module.teardown(...arguments);
    });

    hooks.after(function() {
      module = null;
    });
  };
}
