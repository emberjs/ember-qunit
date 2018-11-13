import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import TestDebugInfo, { getDebugInfo } from 'ember-qunit/-internal/test-debug-info';
import MockStableError, { overrideError, resetError } from './utils/mock-stable-error';
import {
  MockConsole,
  getRandomBoolean,
  getMockDebugInfo,
  getMockSettledState,
} from './utils/test-isolation-helpers';

module('TestDebugInfo', function() {
  test('fullTestName returns concatenated test name', function(assert) {
    assert.expect(1);

    let testDebugInfo = new TestDebugInfo('foo', 'bar', {});

    assert.equal(testDebugInfo.fullTestName, 'foo: bar');
  });

  test('summary returns minimal information when debugInfo is not present', function(assert) {
    assert.expect(1);

    let hasPendingTimers = getRandomBoolean();
    let hasPendingWaiters = getRandomBoolean();
    let hasRunLoop = getRandomBoolean();
    let pendingRequestCount = Math.floor(Math.random(10));
    let hasPendingRequests = Boolean(pendingRequestCount > 0);
    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(
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

    run.backburner.DEBUG = false;

    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(),
      getMockDebugInfo(false, 2, [{ name: 'one', count: 1 }, { name: 'two', count: 1 }])
    );

    assert.deepEqual(testDebugInfo.summary, {
      autorunStackTrace: undefined,
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

  if (getDebugInfo()) {
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
        cancelIds.push(run.later(() => {}, 10000));

        let testDebugInfo = new TestDebugInfo(
          'foo',
          'bar',
          getMockSettledState(),
          run.backburner.getDebugInfo()
        );

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

  test('toConsole correctly prints minimal information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo('foo', 'bar', getMockSettledState());

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(mockConsole.toString(), 'foo: bar');
  });

  test('toConsole correctly prints Scheduled autorun information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(false, true, false, false, 0),
      getMockDebugInfo(new MockStableError('STACK'), 0, null)
    );

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `foo: bar
Scheduled autorun
STACK`
    );
  });

  test('toConsole correctly prints AJAX information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(false, false, false, true, 2)
    );

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `foo: bar
Pending AJAX requests`
    );
  });

  test('toConsole correctly prints pending test waiter information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo('foo', 'bar', getMockSettledState(false, false, true));

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `foo: bar
Pending test waiters`
    );
  });

  test('toConsole correctly prints scheduled async information', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(true, true),
      getMockDebugInfo(false, 2, [{ name: 'one', count: 1 }, { name: 'two', count: 1 }])
    );

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `foo: bar
Scheduled async
STACK
STACK
STACK
STACK`
    );
  });

  test('toConsole correctly prints scheduled async information with only scheduled queue items', function(assert) {
    assert.expect(1);

    let mockConsole = new MockConsole();

    let testDebugInfo = new TestDebugInfo(
      'foo',
      'bar',
      getMockSettledState(),
      getMockDebugInfo(false, 0, [{ name: 'one', count: 1 }, { name: 'two', count: 1 }])
    );

    testDebugInfo.toConsole(mockConsole);

    assert.deepEqual(
      mockConsole.toString(),
      `foo: bar
Scheduled async
STACK
STACK`
    );
  });
});
