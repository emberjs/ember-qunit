export { default as moduleFor } from './legacy-2-x/module-for';
export {
  default as moduleForComponent,
} from './legacy-2-x/module-for-component';
export { default as moduleForModel } from './legacy-2-x/module-for-model';
export { default as QUnitAdapter } from './adapter';
export { module, test, skip, only, todo } from 'qunit';
export { loadTests } from './test-loader';

import { deprecate } from '@ember/debug';
import { loadTests } from './test-loader';
import Ember from 'ember';
import QUnit from 'qunit';
import QUnitAdapter from './adapter';
import {
  setResolver as upstreamSetResolver,
  render as upstreamRender,
  clearRender as upstreamClearRender,
  settled as upstreamSettled,
  pauseTest as upstreamPauseTest,
  resumeTest as upstreamResumeTest,
  setupContext,
  teardownContext,
  setupRenderingContext,
  teardownRenderingContext,
  setupApplicationContext,
  teardownApplicationContext,
  validateErrorHandler,
} from '@ember/test-helpers';
import {
  detectIfTestNotIsolated,
  reportIfTestNotIsolated,
} from './test-isolation-validation';

export function setResolver() {
  deprecate(
    '`setResolver` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.setResolver',
      until: '4.0.0',
    }
  );

  return upstreamSetResolver(...arguments);
}

export function render() {
  deprecate(
    '`render` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.render',
      until: '4.0.0',
    }
  );

  return upstreamRender(...arguments);
}

export function clearRender() {
  deprecate(
    '`clearRender` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.clearRender',
      until: '4.0.0',
    }
  );

  return upstreamClearRender(...arguments);
}

export function settled() {
  deprecate(
    '`settled` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.settled',
      until: '4.0.0',
    }
  );

  return upstreamSettled(...arguments);
}

export function pauseTest() {
  deprecate(
    '`pauseTest` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.pauseTest',
      until: '4.0.0',
    }
  );

  return upstreamPauseTest(...arguments);
}

export function resumeTest() {
  deprecate(
    '`resumeTest` should be imported from `@ember/test-helpers`, but was imported from `ember-qunit`',
    false,
    {
      id: 'ember-qunit.deprecated-reexports.resumeTest',
      until: '4.0.0',
    }
  );

  return upstreamResumeTest(...arguments);
}

export function setupTest(hooks, options) {
  hooks.beforeEach(function(assert) {
    return setupContext(this, options).then(() => {
      let originalPauseTest = this.pauseTest;
      this.pauseTest = function QUnit_pauseTest() {
        assert.timeout(-1); // prevent the test from timing out

        return originalPauseTest.call(this);
      };
    });
  });

  hooks.afterEach(function() {
    return teardownContext(this);
  });
}

export function setupRenderingTest(hooks, options) {
  setupTest(hooks, options);

  hooks.beforeEach(function() {
    return setupRenderingContext(this);
  });

  hooks.afterEach(function() {
    return teardownRenderingContext(this);
  });
}

export function setupApplicationTest(hooks, options) {
  setupTest(hooks, options);

  hooks.beforeEach(function() {
    return setupApplicationContext(this);
  });

  hooks.afterEach(function() {
    return teardownApplicationContext(this);
  });
}

/**
   Uses current URL configuration to setup the test container.

   * If `?nocontainer` is set, the test container will be hidden.
   * If `?dockcontainer` or `?devmode` are set the test container will be
     absolutely positioned.
   * If `?devmode` is set, the test container will be made full screen.

   @method setupTestContainer
 */
export function setupTestContainer() {
  let testContainer = document.getElementById('ember-testing-container');
  if (!testContainer) {
    return;
  }

  let params = QUnit.urlParams;

  let containerVisibility = params.nocontainer ? 'hidden' : 'visible';
  let containerPosition =
    params.dockcontainer || params.devmode ? 'fixed' : 'relative';

  if (params.devmode) {
    testContainer.className = ' full-screen';
  }

  testContainer.style.visibility = containerVisibility;
  testContainer.style.position = containerPosition;

  let qunitContainer = document.getElementById('qunit');
  if (params.dockcontainer) {
    qunitContainer.style.marginBottom = window.getComputedStyle(
      testContainer
    ).height;
  }
}

/**
   Instruct QUnit to start the tests.
   @method startTests
 */
export function startTests() {
  QUnit.start();
}

/**
   Sets up the `Ember.Test` adapter for usage with QUnit 2.x.

   @method setupTestAdapter
 */
export function setupTestAdapter() {
  if (Ember.Test) {
    Ember.Test.adapter = QUnitAdapter.create();
  } else {
    console.warn('Ember.Test was not defined and a test adapter could not be created. This is likely a result of running tests with --environment=production. If this is the case please do not call setupTestAdapter() when running tests in a production enviroment or pass {setupTestAdapter: false} when calling `ember-qunit`\'s start() function.');
  }
}

/**
  Ensures that `Ember.testing` is set to `true` before each test begins
  (including `before` / `beforeEach`), and reset to `false` after each test is
  completed. This is done via `QUnit.testStart` and `QUnit.testDone`.

 */
export function setupEmberTesting() {
  QUnit.testStart(() => {
    Ember.testing = true;
  });

  QUnit.testDone(() => {
    Ember.testing = false;
  });
}

/**
  Ensures that `Ember.onerror` (if present) is properly configured to re-throw
  errors that occur while `Ember.testing` is `true`.
*/
export function setupEmberOnerrorValidation() {
  QUnit.module('ember-qunit: Ember.onerror validation', function() {
    QUnit.test('Ember.onerror is functioning properly', function(assert) {
      assert.expect(1);
      let result = validateErrorHandler();
      assert.ok(
        result.isValid,
        `Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when \`Ember.testing\` is \`true\` or the test suite is unreliable. See https://git.io/vbine for more details.`
      );
    });
  });
}

export function setupTestIsolationValidation() {
  QUnit.testDone(detectIfTestNotIsolated);
  QUnit.done(reportIfTestNotIsolated);
}

/**
   @method start
   @param {Object} [options] Options to be used for enabling/disabling behaviors
   @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
   @param {Boolean} [options.setupTestContainer] If `false` the test container will not
   be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
   @param {Boolean} [options.startTests] If `false` tests will not be automatically started
   (you must run `QUnit.start()` to kick them off).
   @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
   not be updated.
   @param {Boolean} [options.setupEmberTesting] `false` opts out of the
   default behavior of setting `Ember.testing` to `true` before all tests and
   back to `false` after each test will.
   @param {Boolean} [options.setupEmberOnerrorValidation] If `false` validation
   of `Ember.onerror` will be disabled.
   @param {Boolean} [options.setupTestIsolationValidation] If `false` test isolation validation
   will be disabled.
 */
export function start(options = {}) {
  if (options.loadTests !== false) {
    loadTests();
  }

  if (options.setupTestContainer !== false) {
    setupTestContainer();
  }

  if (options.setupTestAdapter !== false) {
    setupTestAdapter();
  }

  if (options.setupEmberTesting !== false) {
    setupEmberTesting();
  }

  if (options.setupEmberOnerrorValidation !== false) {
    setupEmberOnerrorValidation();
  }

  if (
    typeof options.setupTestIsolationValidation !== 'undefined' &&
    options.setupTestIsolationValidation !== false
  ) {
    setupTestIsolationValidation();
  }

  if (options.startTests !== false) {
    startTests();
  }
}
