import Ember from 'ember';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import {
  detectIfTestNotIsolated,
  reportIfTestNotIsolated,
  getMessage,
} from 'ember-qunit/test-isolation-validation';

module('setupTestIsolationValidation', function(hooks) {
  hooks.beforeEach(function() {
    this.cancelId = 0;

    this._waiter = () => {
      return !this.isWaiterPending;
    };

    // In Ember < 2.8 `registerWaiter` expected to be bound to
    // `Ember.Test` 😭
    //
    // Once we have dropped support for < 2.8 we should swap this to
    // use:
    //
    // import { registerWaiter } from '@ember/test';
    Ember.Test.registerWaiter(this._waiter);
  });

  hooks.afterEach(function() {
    Ember.Test.unregisterWaiter(this._waiter);

    run.cancel(this.cancelId);
  });

  test('reportIfTestNotIsolated does not throw when test is isolated', function(assert) {
    assert.expect(1);

    detectIfTestNotIsolated({ module: 'foo', name: 'bar' });
    reportIfTestNotIsolated();

    assert.ok(true);
  });

  test('reportIfTestNotIsolated throws when test has pending timers', function(assert) {
    assert.expect(1);

    this.cancelId = run.later(() => {}, 10);

    detectIfTestNotIsolated({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportIfTestNotIsolated();
      },
      Error,
      getMessage(1, 'foo: bar')
    );
  });

  test('reportIfTestNotIsolated throws when test has test waiters', function(assert) {
    assert.expect(1);

    this.isWaiterPending = true;

    detectIfTestNotIsolated({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportIfTestNotIsolated();
      },
      Error,
      getMessage(1, 'foo: bar')
    );
  });
});
