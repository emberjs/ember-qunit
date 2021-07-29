import { module, test } from 'qunit';
import expectDeprecation from 'ember-qunit/assertions/expect-deprecation';
import expectNoDeprecation from 'ember-qunit/assertions/expect-no-deprecation';
import { deprecate } from '@ember/debug';
import { setupTest } from 'ember-qunit';
// ............................................................
// Deprecation outside of a test. Should not cause test failures.
deprecate('Deprecation outside of a test', false, {
  id: 'deprecation-test',
  until: '3.0.0',
});
// ............................................................

module('expectDeprecation', function (hooks) {
  let mockAssert;

  setupTest(hooks);
  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      pushResult(result) {
        this.pushedResults.push(result);
      },
      expectDeprecation,
    };
  });

  test('called after test and with deprecation', function (assert) {
    deprecate('Something deprecated', false, {
      id: 'deprecation-test',
      until: '3.0.0',
    });

    mockAssert.expectDeprecation();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: true,
    });
  });

  test('called after test and without deprecation', function (assert) {
    mockAssert.expectDeprecation();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: false,
    });
  });

  test('called with callback and with deprecation', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: true,
    });
  });

  test('called with callback and without deprecation', function (assert) {
    mockAssert.expectDeprecation(() => {});

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: false,
    });
  });

  test('called with callback and after test', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    });

    mockAssert.expectDeprecation();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: true,
    });

    // TODO: think about this, old library would have no deprecations here, as the above callback variant would "capture" them
    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: true,
    });
  });

  test('called after test, with matcher and matched deprecation', function (assert) {
    deprecate('Something deprecated', false, {
      id: 'deprecation-test',
      until: '3.0.0',
    });

    mockAssert.expectDeprecation(/Something deprecated/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      result: true,
      message:
        'Expected deprecations during test, but no deprecations were found.',
    });
  });

  test('called after test, with matcher and unmatched deprecation', function (assert) {
    deprecate('Something deprecated', false, {
      id: 'deprecation-test',
      until: '3.0.0',
    });

    mockAssert.expectDeprecation(/different deprecation/);
    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: false,
    });
  });

  test('called with callback, matcher and matched deprecation', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, /Something deprecated/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: true,
    });
  });

  test('called with callback, matcher and unmatched deprecation', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, /different deprecation/);

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
      result: false,
    });
  });

  test('with regex matcher', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, /Somethi[a-z ]*ecated/);
    mockAssert.expectDeprecation(() => {
      deprecate('/Something* deprecated/', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, /Something* deprecated/);

    assert.ok(
      mockAssert.pushedResults[0].result,
      '`expectDeprecation` matched RegExp'
    );
    assert.notOk(
      mockAssert.pushedResults[1].result,
      "`expectDeprecation` didn't RegExp as String match"
    );
  });

  test('with string matcher', function (assert) {
    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, 'Something');

    mockAssert.expectDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    }, 'Something.*');

    assert.ok(
      mockAssert.pushedResults[0].result,
      '`expectDeprecation` captured deprecation for partial String match'
    );
    assert.notOk(
      mockAssert.pushedResults[1].result,
      "`expectDeprecation` didn't test a String match as RegExp"
    );
  });
});

module('expectNoDeprecation', function (hooks) {
  let mockAssert;

  setupTest(hooks);
  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      pushResult(result) {
        this.pushedResults.push(result);
      },
      expectNoDeprecation,
    };
  });

  test('called after test and without deprecation', function (assert) {
    mockAssert.expectNoDeprecation();

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: true,
    });
  });

  // current
  test('called after test and with deprecation', function (assert) {
    deprecate('Something deprecated', false, {
      id: 'deprecation-test',
      until: '3.0.0',
    });

    mockAssert.expectNoDeprecation();
    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: false,
    });
  });

  test('called with callback and with deprecation', function (assert) {
    mockAssert.expectNoDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: false,
    });
  });

  test('called with callback and without deprecation', function (assert) {
    mockAssert.expectNoDeprecation(() => {});

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: true,
    });
  });

  test('called with callback and after test', function (assert) {
    mockAssert.expectNoDeprecation(() => {
      deprecate('Something deprecated', false, {
        id: 'deprecation-test',
        until: '3.0.0',
      });
    });

    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: false,
    });

    mockAssert.expectNoDeprecation();

    // TODO: should we?
    assert.deepEqual(mockAssert.pushedResults.pop(), {
      actual: [
        {
          message: 'Something deprecated',
          options: {
            id: 'deprecation-test',
            until: '3.0.0',
          },
        },
      ],
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
      result: false,
    });
  });
});
