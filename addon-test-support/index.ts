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
import type {
  BaseContext,
  SetupContextOptions,
  TeardownContextOptions,
  TestContext,
} from '@ember/test-helpers';
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

/**
 * Options for configuring the test runner. Normally, you will not need to
 * customize this. It is exported primarily so that end user app code can name
 * it when passing it back to the framework.
 */
export type SetupTestOptions = SetupContextOptions;

type PrivateSetupOptions = SetupContextOptions & TeardownContextOptions;

/**
 * Sets up tests that do not need to render snippets of templates.
 *
 * The `setupTest` method is used for all types of tests except for those
 * that need to render snippets of templates. It is invoked in the callback
 * scope of a QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * this.owner - This exposes the standard "owner API" for the test environment.
 * * this.set / this.setProperties - Allows setting values on the test context.
 * * this.get / this.getProperties - Retrieves values from the test context.
 */
export function setupTest(
  hooks: NestedHooks,
  options?: SetupTestOptions
): void {
  const allOptions: PrivateSetupOptions = { waitForSettled, ...options };

  hooks.beforeEach(async function (
    this: BaseContext,
    assert: Assert
  ): Promise<void> {
    const testMetadata = getTestMetadata(this);
    testMetadata['framework'] = 'qunit';

    await setupContext(this, allOptions);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalPauseTest = (this as TestContext).pauseTest;
    (this as TestContext).pauseTest =
      async function QUnit_pauseTest(): Promise<void> {
        assert.timeout(-1); // prevent the test from timing out

        const timeout = QUnit.config.timeout;

        // This is a temporary work around for
        // https://github.com/emberjs/ember-qunit/issues/496 this clears the
        // timeout that would fail the test when it hits the global testTimeout
        // value.
        if (timeout !== null && timeout !== undefined) {
          clearTimeout(timeout);
        }
        await originalPauseTest.call(this);
      };
  });

  hooks.afterEach(async function (this: TestContext): Promise<void> {
    await teardownContext(this, allOptions);
  });
}

/**
 * Sets up tests that need to render snippets of templates.
 *
 * The setupRenderingTest method is used for tests that need to render
 * snippets of templates. It is also invoked in the callback scope of a
 * QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * All of the methods / properties listed for `setupTest`
 * * An importable render function
 * * this.element - Returns the native DOM element representing the element
 * that was rendered via this.render
 */
export function setupRenderingTest(
  hooks: NestedHooks,
  options?: SetupTestOptions
): void {
  const allOptions: PrivateSetupOptions = { waitForSettled, ...options };

  setupTest(hooks, allOptions);

  hooks.beforeEach(async function (this: TestContext) {
    await setupRenderingContext(this);
  });
}

/**
 * Sets up acceptance tests.
 *
 * The `setupApplicationTest` function is used for all acceptance tests. It
 * is invoked in the callback scope of a QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * `this.owner` - the owner object that been set on the test context.
 * * `this.pauseTest` and `this.resumeTest` - allow easy pausing/resuming of tests.
 * * `this.element` which returns the DOM element representing the application's root element.
 */
export function setupApplicationTest(
  hooks: NestedHooks,
  options?: SetupTestOptions
): void {
  const allOptions: PrivateSetupOptions = { waitForSettled, ...options };

  setupTest(hooks, allOptions);

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

  const params = QUnit.urlParams;

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
  QUnit.testStart(() => {
    installTestNotIsolatedHook(delay);
  });
}

/** Options to be used for enabling/disabling behaviors */
export interface QUnitStartOptions {
  /**
   * If `false` tests will not be loaded automatically.
   */
  loadTests?: boolean | undefined;

  /**
   * If `false` the test container will not be setup based on `devmode`,
   * `dockcontainer`, or `nocontainer` URL params.
   */
  setupTestContainer?: boolean | undefined;

  /**
   * If `false` tests will not be automatically started (you must run
   * `QUnit.start()` to kick them off).
   */
  startTests?: boolean | undefined;

  /**
   * If `false` the default Ember.Test adapter will not be updated.
   */
  setupTestAdapter?: boolean | undefined;

  /**
   * `false` opts out of the default behavior of setting `Ember.testing`
   * to `true` before all tests and back to `false` after each test will.
   */
  setupEmberTesting?: boolean | undefined;

  /**
   * If `false` validation of `Ember.onerror` will be disabled.
   */
  setupEmberOnerrorValidation?: boolean | undefined;

  /**
   * If `false` test isolation validation will be disabled.
   */
  setupTestIsolationValidation?: boolean | undefined;

  /**
   * When using setupTestIsolationValidation this number represents the maximum
   * amount of time in milliseconds that is allowed _after_ the test is
   * completed for all async to have been completed. The default value is 50.
   */
  testIsolationValidationDelay?: number | undefined;
}

export function start(options: QUnitStartOptions = {}): void {
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

// SAFETY: all of the `TC extends TestContext` generics below are just wildly,
// impossibly unsafe. QUnit cannot -- ever! -- guarantee that the test context
// is properly set up in a type-safe way to match this. However, it is the only
// way to handle setting state in a TS-visible way prior to Ember RFC 0785,
// which is slooooowly rolling out across the ecosystem in conjunction with the
// `<template>` feature.

// We need this style to avoid "Subsequent property declarations must have the
// same type" errors
/* eslint-disable @typescript-eslint/method-signature-style */

declare global {
  // NOTE: disables `no-unnecessary-generics` inline because, unfortunately,
  // the design of Ember's test tooling (and indeed *QUnit's* test system)
  // requires that we allow users to update the type of the context of the
  // test. This is indeed strictly *wrong*! However, changing it will require
  // changing how Ember handles testing. See [the PR][pr] for further details.
  //
  // [pr]: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56494

  interface NestedHooks {
    /**
     * Runs after the last test. If additional tests are defined after the
     * module's queue has emptied, it will not run this hook again.
     */
    after<TC extends TestContext>(
      fn:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Runs after each test.
     */
    afterEach<TC extends TestContext>(
      fn:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Runs before the first test.
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    before<TC extends TestContext>(
      fn:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Runs before each test.
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    beforeEach<TC extends TestContext>(
      fn:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;
  }

  interface QUnit {
    /**
     * Add a test to run.
     *
     * Add a test to run using `QUnit.test()`.
     *
     * The `assert` argument to the callback contains all of QUnit's assertion
     * methods. Use this argument to call your test assertions.
     *
     * `QUnit.test()` can automatically handle the asynchronous resolution of a
     * Promise on your behalf if you return a thenable Promise as the result of
     * your callback function.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    test<TC extends TestContext>(
      name: string,
      callback:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Adds a test to exclusively run, preventing all other tests from running.
     *
     * Use this method to focus your test suite on a specific test. QUnit.only
     * will cause any other tests in your suite to be ignored.
     *
     * Note, that if more than one QUnit.only is present only the first instance
     * will run.
     *
     * This is an alternative to filtering tests to run in the HTML reporter. It
     * is especially useful when you use a console reporter or in a codebase
     * with a large set of long running tests.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    only<TC extends TestContext>(
      name: string,
      callback:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Use this method to test a unit of code which is still under development (in a “todo” state).
     * The test will pass as long as one failing assertion is present.
     *
     * If all assertions pass, then the test will fail signaling that `QUnit.todo` should
     * be replaced by `QUnit.test`.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    todo<TC extends TestContext>(
      name: string,
      callback:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;

    /**
     * Adds a test like object to be skipped.
     *
     * Use this method to replace QUnit.test() instead of commenting out entire
     * tests.
     *
     * This test's prototype will be listed on the suite as a skipped test,
     * ignoring the callback argument and the respective global and module's
     * hooks.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    skip<TC extends TestContext>(
      name: string,
      callback?:
        | ((this: TC, assert: Assert) => void)
        | ((this: TC, assert: Assert) => Promise<void>)
    ): void;
  }
}

/* eslint-enable @typescript-eslint/method-signature-style */
