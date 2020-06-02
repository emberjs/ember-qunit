export default function patchAssert(assert) {
  // this catches the native promise unhandled rejection case because QUnit
  // dispatches these to `assert.pushResult`, so we handle the failure being
  // pushed and convert it to a passing assertion
  //
  // Also, on Ember < 2.17 this is called for the RSVP unhandled rejection
  // case (because it goes through Adapter.exception).
  assert.test._originalPushResult = assert.test.pushResult;
  assert.test.pushResult = function (resultInfo) {
    // Inverts the result so we can test failing assertions
    resultInfo.result = !resultInfo.result;
    resultInfo.message = `Failed: ${resultInfo.message}`;
    this._originalPushResult(resultInfo);
  };
}
