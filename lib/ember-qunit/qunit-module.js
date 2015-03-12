import { module as qunitModule } from 'qunit';

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

function addAssertArgumentToContextualizedSteps(steps, assert) {
  var step;

  for (var i = 0, l = steps.length; i < l; i++) {
    step = steps[i];
    steps[i] = generateStepWrapper(step, assert);
  }
}

function generateStepWrapper(step, assert) {
  return function contextualizedStepWrapper () {
    step.call(this, assert);
  };
}

export function createModule(Constructor, name, description, callbacks) {
  normalizeCallbacks(callbacks || description);

  var module = new Constructor(name, description, callbacks);

  qunitModule(module.name, {
    setup: function(assert) {
      addAssertArgumentToContextualizedSteps(module.contextualizedSetupSteps, assert);

      module.setup();
    },
    teardown: function(assert) {
      addAssertArgumentToContextualizedSteps(module.contextualizedTeardownSteps, assert);

      module.teardown();
    }
  });
}
