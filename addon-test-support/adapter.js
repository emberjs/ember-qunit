import Ember from 'ember';
import * as QUnit from 'qunit';

export function nonTestDoneCallback() {}

let Adapter = Ember.Test.Adapter.extend({
  init() {
    this.doneCallbacks = [];
    this.qunit = this.qunit || QUnit;
  },

  asyncStart() {
    let currentTest = this.qunit.config.current;
    let done =
      currentTest && currentTest.assert
        ? currentTest.assert.async()
        : nonTestDoneCallback;
    this.doneCallbacks.push({ test: currentTest, done });
  },

  asyncEnd() {
    let currentTest = this.qunit.config.current;

    if (this.doneCallbacks.length === 0) {
      throw new Error(
        'Adapter asyncEnd called when no async was expected. Please create an issue in ember-qunit.'
      );
    }

    let { test, done } = this.doneCallbacks.pop();

    // In future, we should explore fixing this at a different level, specifically
    // addressing the pairing of asyncStart/asyncEnd behavior in a more consistent way.
    if (test === currentTest) {
      done();
    }
  },
});

export default Adapter;
