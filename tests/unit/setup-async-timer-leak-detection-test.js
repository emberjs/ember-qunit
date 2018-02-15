import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { detectPendingTimers, reportPendingTimers } from 'ember-qunit/async-timer-leak-detection';

module('setupAsyncTimerLeakDetection', function(hooks) {
  hooks.beforeEach(function() {
    this.cancelId = 0;
  });

  hooks.afterEach(function() {
    run.cancel(this.cancelId);
  });

  test('reportPendingTimers does not throw when no pending timers exist', function(assert) {
    assert.expect(1);

    detectPendingTimers({ module: 'foo', name: 'bar' });
    reportPendingTimers();

    assert.ok(true);
  });

  test('reportPendingTimers throws when pending timers exist', function(assert) {
    assert.expect(1);

    this.cancelId = run.later(() => {}, 10);

    detectPendingTimers({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportPendingTimers();
      },
      Error,
      new RegExp(`ASYNC LEAKAGE DETECTED IN TESTS
      The following (1) tests setup a timer that was never torn down before the test completed: \n
      foo: bar`)
    );
  });
});
