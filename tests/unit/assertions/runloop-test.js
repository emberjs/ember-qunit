import { run, begin, later } from '@ember/runloop';
import { test, module } from 'qunit';
import expectNoRunloop from 'ember-qunit/assertions/expect-no-runloop';

module('expectNoRunLoop', function (hooks) {
  let mockAssert;
  hooks.beforeEach(function () {
    mockAssert = {
      pushedResults: [],
      pushResult(result) {
        this.pushedResults.push(result);
      },
      expectNoRunloop,
    };
  });

  test('in a run loop', function (assert) {
    mockAssert.expectNoRunloop();

    assert.deepEqual(mockAssert.pushedResults.shift(), {
      result: true,
      actual: null,
      expected: null,
      message: 'expected no active runloop',
    });

    assert.deepEqual(mockAssert.pushedResults.shift(), {
      result: true,
      actual: false,
      expected: false,
      message: 'expected no active timers',
    });

    begin();

    mockAssert.expectNoRunloop();

    {
      const { result, message } = mockAssert.pushedResults.shift();
      assert.deepEqual(
        { result, message },
        {
          result: false,
          message: 'expected no active runloop',
        }
      );
    }
  });

  test('`expectNoRunLoop` when timers are active', function (assert) {
    later(() => {
      assert.ok(false, 'should not execute');
    });

    assert.ok(run.hasScheduledTimers(), 'expect timers to exist');
    mockAssert.expectNoRunloop();

    {
      const result = mockAssert.pushedResults.shift();

      assert.deepEqual(result, {
        result: true,
        actual: null,
        expected: null,
        message: 'expected no active runloop',
      });
    }

    // TODO: i don't think this should have cancelled timers
    {
      const result = mockAssert.pushedResults.shift();

      assert.deepEqual(result, {
        result: false,
        actual: true,
        expected: false,
        message: 'expected no active timers',
      });
    }

    assert.notOk(
      run.hasScheduledTimers(),
      'expects timers to have all been ended'
    );
  });
});
