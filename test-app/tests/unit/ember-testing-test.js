import { isTesting } from '@ember/debug';
import { module, test } from 'qunit';

module('setupEmberTesting', function () {
  test('isTesting() is true in all test contexts', function (assert) {
    assert.true(isTesting());
  });
});
