import { module, test } from 'qunit';
import { getTestLoaderInstance } from 'ember-qunit/test-loader';

module('getSingtleTestLoaderInstance');

test('A TestLoader instance should be singleton', function(assert) {
  const initialTestLoaderInstance = getTestLoaderInstance();
  const testLoaderInstance = getTestLoaderInstance();

  assert.deepEqual(initialTestLoaderInstance, testLoaderInstance);
});
