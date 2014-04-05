import Ember from 'ember';
import QUnit from 'qunit';
import testContext from './test-context';

function resetViews() {
  Ember.View.views = {};
}

export default function asyncTest(testName, callback) {

  function wrapper() {
    var context = testContext.get();

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

  QUnit.asyncTest(testName, wrapper);
}
