import { module, test } from 'qunit';
import { detectPendingTimers, reportPendingTimers } from 'ember-qunit/async-timer-leak-detection';

module('setupEmberOnerrorValidation', function() {
  test('detectPendingTimers does not queue test info when leaky async timers not detected', function(assert) {
    assert.expect(2);

    let hasPendingTimers = false;
    let pendingTimers = [];
    let callCount = 0;
    let cancelTimers = () => {
      callCount++;
    };

    detectPendingTimers(hasPendingTimers, pendingTimers, '', '', cancelTimers);

    assert.equal(callCount, 0, 'cancel was not called');
    assert.equal(pendingTimers.length, 0, 'pending timers has no pending messages');
  });

  test('detectPendingTimers correctly queues test info when leaky async timers detected', function(assert) {
    assert.expect(3);

    let hasPendingTimers = true;
    let pendingTimers = [];
    let callCount = 0;
    let cancelTimers = () => {
      callCount++;
    };

    detectPendingTimers(hasPendingTimers, pendingTimers, 'module', 'test name', cancelTimers);

    assert.equal(callCount, 1, 'cancel was called');
    assert.equal(pendingTimers.length, 1, 'pending timers has a pending message');
    assert.equal(
      pendingTimers[0],
      'module: test name',
      'pending timers contains the correct message'
    );
  });

  test('reportPendingTimers does not throw when no pending timers exist', function(assert) {
    assert.expect(1);

    reportPendingTimers([]);

    assert.ok(true);
  });

  test('reportPendingTimers throws when pending timers exist', function(assert) {
    assert.expect(1);

    let pendingTimers = [];
    pendingTimers.push('module: test name');

    assert.throws(
      function() {
        reportPendingTimers(pendingTimers);
      },
      `ASYNC LEAKAGE DETECTED IN TESTS
      The following (1) tests setup a timer that was never torn down before the test completed: \n
      module: test name`
    );
  });
});
