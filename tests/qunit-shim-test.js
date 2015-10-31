import {
  module,
  test,
  skip,
  only
} from 'qunit';

module('qunit-shim test');

test('should work!', function(assert) {
  assert.ok('shims should function properly');
});

test('imports skips', function(assert) {
  assert.equal(typeof skip, 'function', 'imports QUnit.skip');
});

test('imports only', function(assert) {
  assert.equal(typeof only, 'function', 'imports QUnit.only');
});
