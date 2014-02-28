define(
  ["ember","qunit","./test-context","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var QUnit = __dependency2__["default"] || __dependency2__;
    var testContext = __dependency3__["default"] || __dependency3__;

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