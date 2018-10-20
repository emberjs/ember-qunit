import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import TestDebugInfo from 'ember-qunit/-internal/test-debug-info';
import getDebugInfoAvailable from 'ember-qunit/-internal/get-debug-info-available';
import MockStableError, { overrideError, resetError } from './utils/mock-stable-error';
import { randomBoolean, getSettledState, debugInfo } from './utils/test-isolation-helpers';

module('TestDebugInfo', function() {
  test('fullTestName returns concatenated test name', function(assert) {
    assert.expect(1);

    let testDebugInfo = new TestDebugInfo('foo', 'bar', {});

    assert.equal(testDebugInfo.fullTestName, 'foo: bar');
  });

  test('summary returns minimal information when debugInfo is not present', function(assert) {
    assert.expect(1);

    let hasPendingTimers = randomBoolean();
    let hasPendingWaiters = randomBoolean();
    let hasRunLoop = randomBoolean();
    let pendingRequestCount = Math.floor(Math.random(10));
    let hasPendingRequests = Boolean(pendingRequestCount > 0);
    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getSettledState(
        hasPendingTimers,
        hasRunLoop,
        hasPendingWaiters,
        hasPendingRequests,
        pendingRequestCount
      )
    );

    assert.deepEqual(testDebugInfo.summary, {
      fullTestName: 'foo: bar',
      hasPendingRequests,
      hasPendingTimers,
      hasPendingWaiters,
      hasRunLoop,
      pendingRequestCount,
    });
  });

  test('summary returns full information when debugInfo is present', function(assert) {
    assert.expect(1);

    let testDebugInfo = new TestDebugInfo('foo', 'bar', getSettledState(), debugInfo);

    assert.deepEqual(testDebugInfo.summary, {
      fullTestName: 'foo: bar',
      hasPendingRequests: false,
      hasPendingTimers: false,
      hasPendingWaiters: false,
      hasRunLoop: false,
      pendingRequestCount: 0,
      pendingScheduledQueueItemCount: 2,
      pendingScheduledQueueItemStackTraces: ['STACK', 'STACK'],
      pendingTimersCount: 2,
      pendingTimersStackTraces: ['STACK', 'STACK'],
    });
  });

  if (getDebugInfoAvailable()) {
    module('when using backburner', function(hooks) {
      let cancelIds;

      hooks.beforeEach(function() {
        cancelIds = [];
        overrideError(MockStableError);
      });

      hooks.afterEach(function() {
        cancelIds.forEach(cancelId => run.cancel(cancelId));

        run.backburner.DEBUG = false;

        resetError();
      });

      test('summary returns full information when debugInfo is present', function(assert) {
        assert.expect(1);

        run.backburner.DEBUG = true;

        cancelIds.push(run.later(() => {}, 5000));

        let debugInfo = run.backburner.getDebugInfo();
        let testDebugInfo = new TestDebugInfo('foo', 'bar', getSettledState(), debugInfo);

        assert.deepEqual(testDebugInfo.summary, {
          fullTestName: 'foo: bar',
          hasPendingRequests: false,
          hasPendingTimers: false,
          hasPendingWaiters: false,
          hasRunLoop: false,
          pendingRequestCount: 0,
          pendingScheduledQueueItemCount: 0,
          pendingScheduledQueueItemStackTraces: [],
          pendingTimersCount: 1,
          pendingTimersStackTraces: ['STACK'],
        });
      });

      test('summary returns full information when debugInfo is present', function(assert) {
        assert.expect(1);

        run.backburner.DEBUG = true;

        cancelIds.push(run.later(() => {}, 5000));
        cancelIds.push(run.later(() => {}, 10000));

        let debugInfo = run.backburner.getDebugInfo();
        let testDebugInfo = new TestDebugInfo('foo', 'bar', getSettledState(), debugInfo);

        assert.deepEqual(testDebugInfo.summary, {
          fullTestName: 'foo: bar',
          hasPendingRequests: false,
          hasPendingTimers: false,
          hasPendingWaiters: false,
          hasRunLoop: false,
          pendingRequestCount: 0,
          pendingScheduledQueueItemCount: 0,
          pendingScheduledQueueItemStackTraces: [],
          pendingTimersCount: 2,
          pendingTimersStackTraces: ['STACK', 'STACK'],
        });
      });
    });
  }
});
