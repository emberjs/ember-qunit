import { moduleFor, test } from 'ember-qunit';
import { setResolverRegistry } from 'tests/test-support/resolver';

function setupRegistry() {
  setResolverRegistry({
    'component:x-foo': Ember.Component.extend()
  });
}

var callbackOrder, setupContext, teardownContext, beforeSetupContext, afterTeardownContext;

moduleFor('component:x-foo', 'TestModule callbacks', {
  beforeSetup: function() {
    beforeSetupContext = this;
    callbackOrder = [ 'beforeSetup' ];

    setupRegistry();
  },

  setup: function(assert, context) {
    setupContext = this;
    callbackOrder.push('setup');

    ok(setupContext !== beforeSetupContext);
    equal(setupContext, context);
  },

  teardown: function(assert, context) {
    teardownContext = this;
    callbackOrder.push('teardown');

    deepEqual(callbackOrder, [ 'beforeSetup', 'setup', 'teardown']);
    equal(setupContext, teardownContext);
    equal(setupContext, context);
  },

  afterTeardown: function() {
    afterTeardownContext = this;
    callbackOrder.push('afterTeardown');

    deepEqual(callbackOrder, [ 'beforeSetup', 'setup', 'teardown', 'afterTeardown']);
    equal(afterTeardownContext, beforeSetupContext);
    ok(afterTeardownContext !== teardownContext);
  }
});

test("setup callbacks called in the correct order", function() {
  deepEqual(callbackOrder, [ 'beforeSetup', 'setup' ]);
});

moduleFor('component:x-foo', 'beforeEach/afterEach callbacks', {
  beforeSetup: function() {
    setupRegistry();
    beforeSetupContext = this;
    callbackOrder = [ 'beforeSetup' ];
  },

  beforeEach: function() {
    setupContext = this;
    callbackOrder.push('beforeEach');

    ok(setupContext !== beforeSetupContext);
  },

  afterEach: function() {
    teardownContext = this;
    callbackOrder.push('afterEach');

    deepEqual(callbackOrder, [ 'beforeSetup', 'beforeEach', 'afterEach']);
    equal(setupContext, teardownContext);
  }
});

test("setup callbacks called in the correct order", function() {
  deepEqual(callbackOrder, [ 'beforeSetup', 'beforeEach' ]);
});

moduleFor('component:x-foo', {
  beforeSetup: setupRegistry,

  beforeEach: function() {
    setupContext = this;
  }
});

test('works properly without description with beforeEach', function() {
  expect(1);

  equal(setupContext, this, 'beforeEach was called properly');
});

moduleFor('component:x-foo', 'test callback argument', {
  beforeSetup: setupRegistry,

  beforeEach: function(assert) {
    assert.ok(!!assert, 'assert was passed into beforeEach');
  },

  afterEach: function(assert) {
    assert.ok(!!assert, 'assert was passed into afterEach');
  }
});

test('callback receives assert argument', function(assert) {
  assert.expect(3);

  assert.ok(!!assert, 'assert argument was present');
});

test('assert argument is not shared between tests', function(assert) {
  assert.expect(4);

  assert.ok(!!assert, 'assert argument was present');
  assert.ok(true, 'dummy extra test');
});

test('context is available as a second param', function(assert, context) {
  assert.equal(this, context);
});
