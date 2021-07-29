import { module, test } from 'qunit';
// import expectAssertion from 'ember-qunit/assertions/expect-assertion';
import { assert as emberAssert } from '@ember/debug';

module.skip('expectAssertion', function (hooks) {
  let mockAssert;

  hooks.beforeEach(() => {
    mockAssert = {
      pushedResults: [],
      expectAssertion,
    };
  });

  test('called with assert', function (assert) {
    mockAssert.expectAssertion(() => {
      emberAssert('testing assert');
    });

    assert.ok(
      mockAssert.pushedResults[0].result,
      '`expectAssertion` captured deprecation call'
    );
  });

  test('called without deprecation', function (assert) {
    mockAssert.expectAssertion(() => {
      emberAssert('testing assert', true);
    });

    assert.notOk(
      mockAssert.pushedResults[0].result,
      '`expectAssertion` logged failed result'
    );
  });

  test('called with deprecation and matched assert', function (assert) {
    mockAssert.expectAssertion(() => {
      emberAssert('testing assert');
    }, /testing/);

    assert.ok(
      mockAssert.pushedResults[0].result,
      '`expectAssertion` captured deprecation call'
    );
  });

  test('called with deprecation and unmatched assert', function (assert) {
    mockAssert.expectAssertion(() => {
      emberAssert('testing assert');
    }, /different/);

    assert.notOk(
      mockAssert.pushedResults[0].result,
      '`expectAssertion` logged failed result'
    );
  });
});
