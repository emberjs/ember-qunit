import Ember from 'ember';
import QUnit from 'qunit';

function unhandledRejectionAssertion(current, error) {
  let message, source;

  if (typeof error === 'object' && error !== null) {
    message = error.message;
    source = error.stack;

  } else if (typeof error === "string") {
    message = error;
    source = "unknown source";
  } else {
    message = "unhandledRejection occured, but it had no message";
    source = "unknown source";
  }

  current.pushResult({
    result: false,
    actual: false,
    expected: true,
    message: message,
    source: source
  });
}

export default Ember.Test.Adapter.extend({
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

  exception(error) {
    unhandledRejectionAssertion(QUnit.config.current, error);
  }
});
