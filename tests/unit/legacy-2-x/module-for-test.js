import Ember from 'ember';
import { module, moduleFor, test } from 'ember-qunit';
import { setResolverRegistry } from '../../helpers/resolver';

function setupRegistry() {
  setResolverRegistry({
    'component:x-foo': Ember.Component.extend(),
  });
}

var callbackOrder, setupContext, teardownContext, beforeSetupContext, afterTeardownContext;

moduleFor('component:x-foo', 'TestModule callbacks', {
  beforeSetup: function () {
    beforeSetupContext = this;
    callbackOrder = ['beforeSetup'];

    setupRegistry();
  },

  beforeEach: function (assert) {
    setupContext = this;
    callbackOrder.push('setup');

    return new Ember.RSVP.Promise((resolve) => {
      setTimeout(() => {
        assert.ok(setupContext !== beforeSetupContext);
        resolve();
      }, 50);
    });
  },

  afterEach: function (assert) {
    teardownContext = this;
    callbackOrder.push('teardown');

    return new Ember.RSVP.Promise((resolve) => {
      setTimeout(() => {
        assert.deepEqual(callbackOrder, ['beforeSetup', 'setup', 'teardown']);
        assert.equal(setupContext, teardownContext);
        resolve();
      }, 50);
    });
  },

  afterTeardown: function (assert) {
    afterTeardownContext = this;
    callbackOrder.push('afterTeardown');

    assert.deepEqual(callbackOrder, ['beforeSetup', 'setup', 'teardown', 'afterTeardown']);
    assert.equal(afterTeardownContext, beforeSetupContext);
    assert.ok(afterTeardownContext !== teardownContext);
  },
});

test('setup callbacks called in the correct order', function (assert) {
  assert.expect(7);
  assert.deepEqual(callbackOrder, ['beforeSetup', 'setup']);
});

moduleFor('component:x-foo', 'beforeEach/afterEach callbacks', {
  before: function () {
    callbackOrder = ['before'];
  },

  beforeSetup: function () {
    setupRegistry();
    beforeSetupContext = this;
    callbackOrder.push('beforeSetup');
  },

  beforeEach: function (assert) {
    setupContext = this;
    callbackOrder.push('beforeEach');

    assert.ok(setupContext !== beforeSetupContext);
  },

  afterEach: function (assert) {
    teardownContext = this;
    callbackOrder.push('afterEach');

    assert.equal(setupContext, teardownContext);
  },

  after: function (assert) {
    callbackOrder.push('after');
    assert.deepEqual(callbackOrder, ['before', 'beforeSetup', 'beforeEach', 'afterEach', 'after']);
  },
});

test('setup callbacks called in the correct order', function (assert) {
  assert.expect(4);
  assert.deepEqual(callbackOrder, ['before', 'beforeSetup', 'beforeEach']);
});

moduleFor('component:x-foo', {
  beforeSetup: setupRegistry,

  beforeEach: function () {
    setupContext = this;
  },
});

test('works properly without description with beforeEach', function (assert) {
  assert.expect(1);

  assert.equal(setupContext, this, 'beforeEach was called properly');
});

moduleFor('component:x-foo', 'test callback argument', {
  beforeSetup: setupRegistry,

  beforeEach: function (assert) {
    assert.ok(!!assert, 'assert was passed into beforeEach');
  },

  afterEach: function (assert) {
    assert.ok(!!assert, 'assert was passed into afterEach');
  },
});

test('callback receives assert argument', function (assert) {
  assert.expect(3);

  assert.ok(!!assert, 'assert argument was present');
});

test('assert argument is not shared between tests', function (assert) {
  assert.expect(4);

  assert.ok(!!assert, 'assert argument was present');
  assert.ok(true, 'dummy extra test');
});

module('Wrapper', function (hooks) {
  hooks.beforeEach(setupRegistry);

  moduleFor('component:x-foo', 'Some description');

  test('works properly without callbacks', function (assert) {
    assert.expect(1);
    assert.ok(this.subject());
  });

  moduleFor('component:x-foo');

  test('works properly without description or callbacks', function (assert) {
    assert.expect(1);
    assert.ok(this.subject());
  });
});
