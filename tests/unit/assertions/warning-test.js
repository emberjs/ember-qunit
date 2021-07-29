import { module, test } from 'qunit';
import expectWarning from 'ember-qunit/assertions/expect-warning';
import expectNoWarning from 'ember-qunit/assertions/expect-no-warning';
import { warn } from '@ember/debug';

import { setupTest } from 'ember-qunit';
// ............................................................
// Warning outside of a test. Should not cause test failures.
warn('Warning outside of a test', false, {
  id: 'warning-test',
  until: '3.0.0',
});
// ............................................................

module('expectWarning', function (hooks) {
  let mockAssert;
  setupTest(hooks);

  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      pushResult(results) {
        this.pushedResults.push(results);
      },
      expectWarning,
    };
  });

  test('called after test and with warning', function (assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });
  });

  test('called after test and without warning', function (assert) {
    mockAssert.expectWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: false,
    });
  });

  test('called with callback and with warning', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });
  });

  test('called with callback and without warning', function (assert) {
    mockAssert.expectWarning(() => {});

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: false,
    });
  });

  test('called with callback and after test', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });

    mockAssert.expectWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });
  });

  test('called after test, with matcher and matched warning', function (assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning(/Something warned/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });
  });

  test('called after test, with matcher and unmatched warning', function (assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectWarning(/different warning/);

    assert.notOk(
      mockAssert.pushedResults[0].result,
      '`expectWarning` logged failed result'
    );
  });

  test('called with callback, matcher and matched warning', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Something warned/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });
  });

  test('called with callback, matcher and unmatched warning', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /different warning/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: false,
    });
  });

  test('with regex matcher', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Somethi[a-z ]*rned/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });

    mockAssert.expectWarning(() => {
      warn('/Something* warned/', false, {
        id: 'warning-test',
        until: '3.0.0',
      });
    }, /Something* warned/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: false,
    });
  });

  test('with string matcher', function (assert) {
    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something');

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: true,
    });

    mockAssert.expectWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something.*');

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message: 'Expected warnings during test, but no warnings were found.',
      result: false,
    });
  });
});

module('expectNoWarning', function (hooks) {
  let mockAssert;
  setupTest(hooks);

  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      pushResult(results) {
        this.pushedResults.push(results);
      },
      expectNoWarning,
    };
  });

  test('expectNoWarning called after test and without warning', function (assert) {
    mockAssert.expectNoWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: true,
    });
  });

  test('expectNoWarning called after test and with warning', function (assert) {
    warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    mockAssert.expectNoWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: false,
    });
  });

  test('expectNoWarning called with callback and with warning', function (assert) {
    mockAssert.expectNoWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: false,
    });
  });

  test('expectNoWarning called with callback and without warning', function (assert) {
    mockAssert.expectNoWarning(() => {});

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: true,
    });
  });

  test('expectNoWarning called with callback and after test', function (assert) {
    mockAssert.expectNoWarning(() => {
      warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: false,
    });

    // TODO: sHould this pass or fail?
    mockAssert.expectNoWarning();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something warned',
          options: {
            id: 'warning-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message: 'Expected no warnings during test, but warnings were found.',
      result: false,
    });
  });
});
