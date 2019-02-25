import Ember from 'ember';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { installTestNotIsolatedHook } from 'ember-qunit/test-isolation-validation';
import { getDebugInfo } from '@ember/test-helpers';

import patchAssert from './utils/patch-assert-helper';

run.backburner.DEBUG = true;

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
      this.cancelId = 0;
      run.backburner.DEBUG = true;

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

    module('timeouts', function(hooks) {
      hooks.afterEach(function(assert) {
        assert.test._originalPushResult({
          result:
            assert.test.assertions[0].message.indexOf('Failed: Test took longer than 50ms') === 0,
        });
      });

      test('detectIfTestNotIsolated outputs debug info on test timeout', function(assert) {
        assert.expect(1);
        assert.timeout(50);

        assert.async();

        let testPushFailure = assert.test.pushFailure;

        patchAssert(assert);

        assert.test.pushFailure = testPushFailure;

        run.later(() => {}, 100);
      });
    });
  });
}
