/* globals Testem */

export { default as QUnitAdapter, nonTestDoneCallback } from './adapter';
export { loadTests } from './test-loader';

import './qunit-configuration';

// @ts-expect-error FIXME
if (typeof Testem !== 'undefined') {
  // @ts-expect-error FIXME
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  Testem.hookIntoTestFramework();
}

import { _backburner } from '@ember/runloop';
import type { BaseContext, TestContext } from '@ember/test-helpers';
import {
  getTestMetadata,
  resetOnerror,
  setupApplicationContext,
  setupContext,
  setupRenderingContext,
  teardownContext,
  validateErrorHandler,
} from '@ember/test-helpers';
import Ember from 'ember';

import * as QUnit from 'qunit';

import QUnitAdapter from './adapter';
import { installTestNotIsolatedHook } from './test-isolation-validation';
import { loadTests } from './test-loader';

let waitForSettled = true;

export type SetupOptions = Parameters<typeof setupContext>[1];

type PrivateSetupOptions = SetupOptions & {
  waitForSettled?: boolean;
};

export function setupTest(hooks: GlobalHooks, _options: SetupOptions): void {
  const options: PrivateSetupOptions = { waitForSettled, ..._options };

  hooks.beforeEach(async function (
    this: BaseContext,
    assert: Assert
  ): Promise<void> {
    const testMetadata = getTestMetadata(this);
    testMetadata['framework'] = 'qunit';

    await setupContext(this, options);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalPauseTest = (this as TestContext).pauseTest;
    (this as TestContext).pauseTest =
      async function QUnit_pauseTest(): Promise<void> {
        assert.timeout(-1); // prevent the test from timing out

        // This is a temporary work around for
        // https://github.com/emberjs/ember-qunit/issues/496 this clears the
        // timeout that would fail the test when it hits the global testTimeout
        // value.
        // @ts-expect-error FIXME
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearTimeout(QUnit.config.timeout);
        await originalPauseTest.call(this);
      };
  });

  hooks.afterEach(async function (this: TestContext): Promise<void> {
    await teardownContext(this, options);
  });
}

export function setupRenderingTest(
  hooks: GlobalHooks,
  _options: SetupOptions
): void {
  const options: PrivateSetupOptions = { waitForSettled, ..._options };

  setupTest(hooks, options);

  hooks.beforeEach(async function (this: TestContext) {
    await setupRenderingContext(this);
  });
}

export function setupApplicationTest(
  hooks: GlobalHooks,
  _options: SetupOptions
): void {
  const options: PrivateSetupOptions = { waitForSettled, ..._options };

  setupTest(hooks, options);

  hooks.beforeEach(async function (this: TestContext) {
    await setupApplicationContext(this);
  });
}

/**
   Uses current URL configuration to setup the test container.

   * If `?nocontainer` is set, the test container will be hidden.
   * If `?devmode` or `?fullscreencontainer` is set, the test container will be
     made full screen.

   @method setupTestContainer
 */
export function setupTestContainer(): void {
  const testContainer = document.getElementById('ember-testing-container');
  if (!testContainer) {
    return;
  }

  // @ts-expect-error FIXME
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const params: Record<string, unknown> = QUnit.urlParams;

  if (params['devmode'] || params['fullscreencontainer']) {
    testContainer.classList.add('ember-testing-container-full-screen');
  }

  if (params['nocontainer']) {
    testContainer.classList.add('ember-testing-container-hidden');
  }
}

/**
   Instruct QUnit to start the tests.
   @method startTests
 */
export function startTests(): void {
  QUnit.start();
}

/**
   Sets up the `Ember.Test` adapter for usage with QUnit 2.x.

   @method setupTestAdapter
 */
export function setupTestAdapter(): void {
  // @ts-expect-error FIXME
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Ember.Test.adapter = QUnitAdapter.create() as typeof QUnitAdapter;
}

/**
  Ensures that `Ember.testing` is set to `true` before each test begins
  (including `before` / `beforeEach`), and reset to `false` after each test is
  completed. This is done via `QUnit.testStart` and `QUnit.testDone`.

 */
export function setupEmberTesting(): void {
  QUnit.testStart(() => {
    // @ts-expect-error FIXME
    Ember.testing = true;
  });

  QUnit.testDone(() => {
    // @ts-expect-error FIXME
    Ember.testing = false;
  });
}

/**
  Ensures that `Ember.onerror` (if present) is properly configured to re-throw
  errors that occur while `Ember.testing` is `true`.
*/
export function setupEmberOnerrorValidation(): void {
  QUnit.module('ember-qunit: Ember.onerror validation', function () {
    QUnit.test('Ember.onerror is functioning properly', function (assert) {
      assert.expect(1);
      const result = validateErrorHandler();
      assert.ok(
        result.isValid,
        `Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when \`Ember.testing\` is \`true\` or the test suite is unreliable. See https://git.io/vbine for more details.`
      );
    });
  });
}

export function setupResetOnerror(): void {
  QUnit.testDone(resetOnerror);
}

export function setupTestIsolationValidation(delay?: number | undefined): void {
  waitForSettled = false;
  _backburner.DEBUG = true;
  // @ts-expect-error FIXME
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  QUnit.on('testStart', () => {
    installTestNotIsolatedHook(delay);
  });
}

export interface StartOptions {
  loadTests?: boolean;
  setupTestContainer?: boolean;
  startTests?: boolean;
  setupTestAdapter?: boolean;
  setupEmberTesting?: boolean;
  setupEmberOnerrorValidation?: boolean;
  setupTestIsolationValidation?: boolean;
  testIsolationValidationDelay?: number;
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
export function start(options: StartOptions = {}): void {
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
    typeof options.testIsolationValidationDelay !== 'undefined' &&
    options.setupTestIsolationValidation !== false
  ) {
    setupTestIsolationValidation(options.testIsolationValidationDelay);
  }

  if (options.startTests !== false) {
    startTests();
  }

  setupResetOnerror();
}
