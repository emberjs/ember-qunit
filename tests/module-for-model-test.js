import Ember from 'ember';
import DS from 'ember-data';
import { moduleForModel, test } from 'ember-qunit';
import { setResolverRegistry } from 'tests/test-support/resolver';

var Whazzit = DS.Model.extend({ gear: DS.attr('string') });
var whazzitAdapterFindAllCalled = false;
var WhazzitAdapter = DS.FixtureAdapter.extend({
  findAll: function() {
    whazzitAdapterFindAllCalled = true;
    return this._super.apply(this, arguments);
  }
});

var ApplicationAdapter = DS.FixtureAdapter.extend();

function setupRegistry() {
  setResolverRegistry({
    'model:whazzit': Whazzit,
    'adapter:whazzit': WhazzitAdapter,
    'adapter:application': ApplicationAdapter
  });
}

///////////////////////////////////////////////////////////////////////////////

moduleForModel('whazzit', 'model:whazzit without adapter', {
  beforeSetup: function() {
    setupRegistry();
  },

  beforeEach: function() {
    Whazzit.FIXTURES = [];
  }
});

test('store exists', function(assert) {
  var store = this.store();
  assert.ok(store instanceof DS.Store);
});

test('model exists as subject', function(assert) {
  var model = this.subject();
  assert.ok(model);
  assert.ok(model instanceof DS.Model);
  assert.ok(model instanceof Whazzit);
});

test('FixtureAdapter is registered for model', function(assert) {
  var model = this.subject(),
    store = this.store();

  assert.ok(store.adapterFor(model.constructor) instanceof DS.FixtureAdapter);
  assert.notOk(store.adapterFor(model.constructor) instanceof WhazzitAdapter);
});

///////////////////////////////////////////////////////////////////////////////

moduleForModel('whazzit', 'model:whazzit with custom adapter', {
  needs: ['adapter:whazzit'],

  beforeSetup: function() {
    setupRegistry();
  },

  setup: function() {
    Whazzit.FIXTURES = [];
    whazzitAdapterFindAllCalled = false;
  }
});

test('WhazzitAdapter is registered for model', function(assert) {
  var model = this.subject(),
    store = this.store();

  assert.ok(store.adapterFor(model.constructor) instanceof WhazzitAdapter);
});

test('WhazzitAdapter is used for `find`', function(assert) {
  assert.expect(2);
  assert.notOk(whazzitAdapterFindAllCalled, 'precond - custom adapter has not yet been called');

  var store = this.store();

  return Ember.run(function() {
    return store.find('whazzit').then(function() {
      assert.ok(whazzitAdapterFindAllCalled, 'uses the custom adapter');
    });
  });
});

///////////////////////////////////////////////////////////////////////////////

moduleForModel('whazzit', 'model:whazzit with application adapter', {
  needs: ['adapter:application'],

  beforeSetup: function() {
    setupRegistry();
  },

  setup: function() {
    Whazzit.FIXTURES = [];
  }
});

test('ApplicationAdapter is registered for model', function(assert) {
  var model = this.subject(),
      store = this.store();

  assert.ok(store.adapterFor(model.constructor) instanceof ApplicationAdapter);
  assert.notOk(store.adapterFor(model.constructor) instanceof WhazzitAdapter);
});