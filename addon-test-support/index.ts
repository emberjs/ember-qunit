/* globals Testem */

export { default as QUnitAdapter, nonTestDoneCallback } from './adapter';
export { loadTests } from './test-loader';

import './qunit-configuration';

if (typeof Testem !== 'undefined') {
  Testem.hookIntoTestFramework();
}

import { _backburner } from '@ember/runloop';
import { resetOnerror, getTestMetadata } from '@ember/test-helpers';
import { loadTests } from './test-loader';
import Ember from 'ember';
import * as QUnit from 'qunit';
import QUnitAdapter from './adapter';
import {
  setupContext,
  teardownContext,
  setupRenderingContext,
  setupApplicationContext,
  validateErrorHandler,
} from '@ember/test-helpers';
import { installTestNotIsolatedHook } from './test-isolation-validation';

let waitForSettled = true;

export function setupTest(hooks, _options) {
  let options = { waitForSettled, ..._options };

  hooks.beforeEach(function (assert) {
    let testMetadata = getTestMetadata(this);
    testMetadata.framework = 'qunit';

    return setupContext(this, options).then(() => {
      let originalPauseTest = this.pauseTest;
      this.pauseTest = function QUnit_pauseTest() {
        assert.timeout(-1); // prevent the test from timing out

        // This is a temporary work around for
        // https://github.com/emberjs/ember-qunit/issues/496 this clears the
        // timeout that would fail the test when it hits the global testTimeout
        // value.
        clearTimeout(QUnit.config.timeout);
        return originalPauseTest.call(this);
      };
    });
  });

  hooks.afterEach(function () {
    return teardownContext(this, options);
  });
}

export function setupRenderingTest(hooks, _options) {
  let options = { waitForSettled, ..._options };

  setupTest(hooks, options);

  hooks.beforeEach(function () {
    return setupRenderingContext(this);
  });
}

export function setupApplicationTest(hooks, _options) {
  let options = { waitForSettled, ..._options };

  setupTest(hooks, options);

  hooks.beforeEach(function () {
    return setupApplicationContext(this);
  });
}

/**
   Uses current URL configuration to setup the test container.

   * If `?nocontainer` is set, the test container will be hidden.
   * If `?devmode` or `?fullscreencontainer` is set, the test container will be
     made full screen.

   @method setupTestContainer
 */
export function setupTestContainer() {
  let testContainer = document.getElementById('ember-testing-container');
  if (!testContainer) {
    return;
  }

  let params = QUnit.urlParams;

  if (params.devmode || params.fullscreencontainer) {
    testContainer.classList.add('ember-testing-container-full-screen');
  }

  if (params.nocontainer) {
    testContainer.classList.add('ember-testing-container-hidden');
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
  Ember.Test.adapter = QUnitAdapter.create();
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
  QUnit.module('ember-qunit: Ember.onerror validation', function () {
    QUnit.test('Ember.onerror is functioning properly', function (assert) {
      assert.expect(1);
      let result = validateErrorHandler();
      assert.ok(
        result.isValid,
        `Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when \`Ember.testing\` is \`true\` or the test suite is unreliable. See https://git.io/vbine for more details.`
      );
    });
  });
}

export function setupResetOnerror() {
  QUnit.testDone(resetOnerror);
}

export function setupTestIsolationValidation(delay) {
  waitForSettled = false;
  _backburner.DEBUG = true;
  QUnit.on('testStart', () => installTestNotIsolatedHook(delay));
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
   @param {Number} [options.testIsolationValidationDelay] When using
   setupTestIsolationValidation this number represents the maximum amount of
   time in milliseconds that is allowed _after_ the test is completed for all
   async to have been completed. The default value is 50.
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
    setupTestIsolationValidation(options.testIsolationValidationDelay);
  }

  if (options.startTests !== false) {
    startTests();
  }

  setupResetOnerror();
}
