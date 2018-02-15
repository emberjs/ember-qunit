import Ember from 'ember';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import {
  detectIfNotSettled,
  reportIfNotSettled,
  getMessage,
} from 'ember-qunit/tests-not-settled-detection';

module('setupTestsNotSettledDetection', function(hooks) {
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

  test('reportIfNotSettled does not throw when test has settled', function(assert) {
    assert.expect(1);

    detectIfNotSettled({ module: 'foo', name: 'bar' });
    reportIfNotSettled();

    assert.ok(true);
  });

  test('reportIfNotSettled throws when test has not settled pending timers', function(assert) {
    assert.expect(1);

    this.cancelId = run.later(() => {}, 10);

    detectIfNotSettled({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportIfNotSettled();
      },
      Error,
      getMessage(1, 'foo: bar')
    );
  });

  test('reportIfNotSettled throws when test has not settled test waiters', function(assert) {
    assert.expect(1);

    this.isWaiterPending = true;

    detectIfNotSettled({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportIfNotSettled();
      },
      Error,
      getMessage(1, 'foo: bar')
    );
  });
});
