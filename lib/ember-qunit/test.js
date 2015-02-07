import Ember from 'ember';
import { getContext } from 'ember-test-helpers';
import { test as qunitTest } from 'qunit';

function resetViews() {
  Ember.View.views = {};
}

export default function test(testName, callback) {
  function wrapper(assert) {
    var context = getContext();

    resetViews();
    var result = callback.call(context, assert);

    function failTestOnPromiseRejection(reason) {
      ok(false, reason);
    }

    Ember.run(function(){
      QUnit.stop();
      Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
    });
  }

  qunitTest(testName, wrapper);
}
