import {
  module,
  test,
  skip
} from 'qunit';

module('qunit-shim test');

test('should work!', function(assert) {
  assert.ok('shims should function properly');
});

test('imports skips', function(assert) {
  assert.equal(typeof skip, 'function', 'imports QUnit.skip');
});
