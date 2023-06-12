import Ember from 'ember';
import { module } from 'qunit';
import { setupEmberOnerrorValidation } from 'ember-qunit';

module('setupEmberOnerrorValidation', function (hooks) {
  hooks.beforeEach(function (assert) {
    let originalPushResult = assert.pushResult;
    assert.pushResult = function (resultInfo) {
      // Inverts the result so we can test failing assertions
      resultInfo.result = !resultInfo.result;
      resultInfo.message = `Failed: ${resultInfo.message}`;
      originalPushResult(resultInfo);
    };

    this.originalEmberOnerror = Ember.onerror;
    Ember.onerror = function () {
      // intentionally swallowing here
    };
  });

  hooks.afterEach(function () {
    Ember.onerror = this.originalEmberOnerror;
  });

  setupEmberOnerrorValidation();
});
