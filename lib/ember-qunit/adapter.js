import Ember from 'ember';
import QUnit from 'qunit';

export default Ember.Test.Adapter.extend({
  init() {
    this.doneCallbacks = [];
  },

  asyncStart() {
    this.doneCallbacks.push(QUnit.config.current.assert.async());
  },

  asyncEnd() {
    this.doneCallbacks.pop()();
  },

  exception(error) {
    QUnit.config.current.assert.ok(false, Ember.inspect(error));
  }
});
