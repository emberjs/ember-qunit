define(
  ["./test-context","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var testContext = __dependency1__["default"] || __dependency1__;

    function resetViews() {
      Ember.View.views = {};
    }

    __exports__["default"] = function test(testName, callback) {
      var context = testContext.get(); // save refence

      function wrapper() {
        resetViews();
        var result = callback.call(context);

        function failTestOnPromiseRejection(reason) {
          ok(false, reason);
        }

        Ember.run(function(){
          stop();
          Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
        });
      }

      QUnit.test(testName, wrapper);
    }
  });