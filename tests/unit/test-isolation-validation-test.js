import Ember from 'ember';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { installTestNotIsolatedHook } from 'ember-qunit/test-isolation-validation';
import { getDebugInfo } from 'ember-qunit/-internal/test-debug-info';

import patchAssert from './utils/patch-assert-helper';

if (getDebugInfo()) {
  module('test isolation validation', function(hooks) {
    let isWaiterPending = false;
    let waiter = () => {
      return !isWaiterPending;
    };

    // In Ember < 2.8 `registerWaiter` expected to be bound to
    // `Ember.Test` 😭
    //
    // Once we have dropped support for < 2.8 we should swap this to
    // use:
    //
    // import { registerWaiter } from '@ember/test';
    Ember.Test.registerWaiter(waiter);

    QUnit.on('testEnd', function() {
      Ember.Test.unregisterWaiter(this._waiter);
    });

    hooks.beforeEach(function() {
      run.backburner.DEBUG = true;
      this.cancelId = 0;

      installTestNotIsolatedHook();
    });

    test('detectIfTestNotIsolated does not add failing assertion when test is isolated', function(assert) {
      assert.expect(1);

      assert.ok(true);
    });

    test('detectIfTestNotIsolated adds failing assertion when test has pending timers', function(assert) {
      assert.expect(1);
      patchAssert(assert);

      this.cancelId = run.later(() => {}, 1000);
    });

    test('detectIfTestNotIsolated adds failing assertion when test has test waiters', function(assert) {
      assert.expect(1);
      patchAssert(assert);

      isWaiterPending = true;
    });
  });
}
