import Ember from 'ember';
import QUnit from 'qunit';

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
    QUnit.config.current.assert.ok(false, Ember.inspect(error));
  }
});
