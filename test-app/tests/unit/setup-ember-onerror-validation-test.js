import { module } from 'qunit';
import { setupEmberOnerrorValidation } from 'ember-qunit';
import { getOnerror, setOnerror } from '@ember/-internals/error-handling';

module('setupEmberOnerrorValidation', function (hooks) {
  hooks.beforeEach(function (assert) {
    let originalPushResult = assert.pushResult;
    assert.pushResult = function (resultInfo) {
      // Inverts the result so we can test failing assertions
      resultInfo.result = !resultInfo.result;
      resultInfo.message = `Failed: ${resultInfo.message}`;
      originalPushResult(resultInfo);
    };

    this.originalEmberOnerror = getOnerror();
    setOnerror(function () {
      // intentionally swallowing here
    });
  });

  hooks.afterEach(function () {
    setOnerror(this.originalEmberOnerror);
  });

  setupEmberOnerrorValidation();
});
