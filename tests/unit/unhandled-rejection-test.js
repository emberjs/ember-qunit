import { Promise as RSVPPromise } from 'rsvp';
import { module, test } from 'qunit';

const HAS_NATIVE_PROMISE = typeof Promise !== 'undefined';
const HAS_UNHANDLED_REJECTION_HANDLER = 'onunhandledrejection' in window;

module('unhandle promise rejections', function(hooks) {
  let WINDOW_ONERROR;

  hooks.beforeEach(function(assert) {
    // capturing this outside of module scope to ensure we grab
    // the test frameworks own window.onerror to reset it
    WINDOW_ONERROR = window.onerror;

    // this catches the native promise unhandled rejection case because QUnit
    // dispatches these to `assert.pushResult`, so we handle the failure being
    // pushed and convert it to a passing assertion
    //
    // Also, on Ember < 2.17 this is called for the RSVP unhandled rejection
    // case (because it goes through Adapter.exception).
    assert._originalPushResult = assert.pushResult;
    assert.pushResult = function(resultInfo) {
      // Inverts the result so we can test failing assertions
      resultInfo.result = !resultInfo.result;
      resultInfo.message = `Failed: ${resultInfo.message}`;
      this._originalPushResult(resultInfo);
    };
  });

  hooks.afterEach(function() {
    window.onerror = WINDOW_ONERROR;
  });

  test('RSVP promises cause an unhandled rejection', function(assert) {
    let done = assert.async();

    window.onerror = message => {
      assert._originalPushResult({
        result: /whoops!/.test(message),
        actual: message,
        expected: 'to include `whoops!`',
        message:
          'error should bubble out to window.onerror, and therefore fail tests (due to QUnit implementing window.onerror)',
      });

      return true; // prevent "bubbling" and therefore failing the test
    };

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
