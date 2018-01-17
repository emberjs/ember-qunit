import { Promise as RSVPPromise } from 'rsvp';
import { module, test } from 'qunit';

const HAS_NATIVE_PROMISE = typeof Promise !== 'undefined';
const HAS_UNHANDLED_REJECTION_HANDLER = 'onunhandledrejection' in window;

module('unhandle promise rejections', function(hooks) {
  hooks.beforeEach(function(assert) {
    let originalPushResult = assert.pushResult;
    assert.pushResult = function(resultInfo) {
      // Inverts the result so we can test failing assertions
      resultInfo.result = !resultInfo.result;
      resultInfo.message = `Failed: ${resultInfo.message}`;
      originalPushResult(resultInfo);
    };
  });

  test('RSVP promises cause an unhandled rejection', function(assert) {
    let done = assert.async();

    // ensure we do not exit this test until the assertion has happened
    setTimeout(done, 10);

    new RSVPPromise(resolve => {
      setTimeout(resolve);
    }).then(function() {
      throw new Error('whoops!');
    });
  });

  if (HAS_NATIVE_PROMISE && HAS_UNHANDLED_REJECTION_HANDLER) {
    test('native promises cause an unhandled rejection', function(assert) {
      let done = assert.async();

      // ensure we do not exit this test until the assertion has happened
      setTimeout(done, 10);

      new self.Promise(resolve => {
        setTimeout(resolve);
      }).then(function() {
        throw new Error('whoops!');
      });
    });
  }
});
