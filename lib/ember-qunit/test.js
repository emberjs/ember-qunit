import Ember from 'ember';
import { getContext } from 'ember-test-helpers';

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

  QUnit.test(testName, wrapper);
}
