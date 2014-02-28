import Ember from 'ember';
import QUnit from 'qunit';
import testContext from './test-context';

function resetViews() {
  Ember.View.views = {};
}

export default function test(testName, callback) {
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

