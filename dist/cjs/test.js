"use strict";
var Ember = require("ember")["default"] || require("ember");
var QUnit = require("qunit")["default"] || require("qunit");
var testContext = require("./test-context")["default"] || require("./test-context");

function resetViews() {
  Ember.View.views = {};
}

exports["default"] = function test(testName, callback) {
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