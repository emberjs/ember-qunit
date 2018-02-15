import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { detectIfNotSettled, reportIfNotSettled } from 'ember-qunit/tests-not-settled-detection';

module('setupTestsNotSettledDetection', function(hooks) {
  hooks.beforeEach(function() {
    this.cancelId = 0;
  });

  hooks.afterEach(function() {
    run.cancel(this.cancelId);
  });

  test('reportIfNotSettled does not throw when no pending timers exist', function(assert) {
    assert.expect(1);

    detectIfNotSettled({ module: 'foo', name: 'bar' });
    reportIfNotSettled();

    assert.ok(true);
  });

  test('reportPendingTimers throws when pending timers exist', function(assert) {
    assert.expect(1);

    this.cancelId = run.later(() => {}, 10);

    detectIfNotSettled({ module: 'foo', name: 'bar' });

    assert.throws(
      function() {
        reportIfNotSettled();
      },
      Error,
      new RegExp(`ASYNC LEAKAGE DETECTED IN TESTS
      The following (1) tests setup a timer that was never torn down before the test completed: \n
      foo: bar`)
    );
  });
});
