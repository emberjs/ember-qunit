import Ember from 'ember';
import { module, test } from 'qunit';

module('setupEmberTesting', function () {
  test('Ember.testing is true in all test contexts', function (assert) {
    assert.true(Ember.testing);
  });
});
