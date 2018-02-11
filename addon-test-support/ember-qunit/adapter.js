import Ember from 'ember';
import QUnit from 'qunit';
import hasEmberVersion from '@ember/test-helpers/has-ember-version';

function unhandledRejectionAssertion(current, error) {
  let message, source;

  if (typeof error === 'object' && error !== null) {
    message = error.message;
    source = error.stack;
  } else if (typeof error === 'string') {
    message = error;
    source = 'unknown source';
  } else {
    message = 'unhandledRejection occured, but it had no message';
    source = 'unknown source';
  }

  current.assert.pushResult({
    result: false,
    actual: false,
    expected: true,
    message: message,
    source: source,
  });
}

let Adapter = Ember.Test.Adapter.extend({
  init() {
    this.doneCallbacks = [];
  },

  asyncStart() {
    this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
  },

  asyncEnd() {
    let done = this.doneCallbacks.pop();
    // This can be null if asyncStart() was called outside of a test
    if (done) {
      done();
    }
  },

  // clobber default implementation of `exception` will be added back for Ember
  // < 2.17 just below...
  exception: null,
});

// Ember 2.17 and higher do not require the test adapter to have an `exception`
// method When `exception` is not present, the unhandled rejection is
// automatically re-thrown and will therefore hit QUnit's own global error
// handler (therefore appropriately causing test failure)
if (!hasEmberVersion(2, 17)) {
  Adapter = Adapter.extend({
    exception(error) {
      unhandledRejectionAssertion(QUnit.config.current, error);
    },
  });
}

export default Adapter;
