export { default as moduleFor } from './legacy-2-x/module-for';
export { default as moduleForComponent } from './legacy-2-x/module-for-component';
export { default as moduleForModel } from './legacy-2-x/module-for-model';
export { default as QUnitAdapter } from './adapter';
export {
  setResolver,
  render,
  clearRender,
  settled,
  pauseTest,
  resumeTest,
} from '@ember/test-helpers';
export { module, test, skip, only, todo } from 'qunit';
export { loadTests } from './test-loader';

import { loadTests } from './test-loader';
import Ember from 'ember';
import QUnit from 'qunit';
import QUnitAdapter from './adapter';
import {
  setupContext,
  teardownContext,
  setupRenderingContext,
  teardownRenderingContext,
} from '@ember/test-helpers';

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
  let containerPosition = params.dockcontainer || params.devmode ? 'fixed' : 'relative';

  if (params.devmode) {
    testContainer.className = ' full-screen';
  }

  testContainer.style.visibility = containerVisibility;
  testContainer.style.position = containerPosition;

  let qunitContainer = document.getElementById('qunit');
  if (params.dockcontainer) {
    qunitContainer.style.marginBottom = window.getComputedStyle(testContainer).height;
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
   @method start
   @param {Object} [options] Options to be used for enabling/disabling behaviors
   @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
   @param {Boolean} [options.setupTestContainer] If `false` the test container will not
   be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
   @param {Boolean} [options.startTests] If `false` tests will not be automatically started
   (you must run `QUnit.start()` to kick them off).
   @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
   not be updated.
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

  if (options.startTests !== false) {
    startTests();
  }
}
