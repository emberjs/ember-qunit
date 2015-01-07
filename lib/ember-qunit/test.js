import Ember from 'ember';
import { getContext } from 'ember-test-helpers';

function resetViews() {
  Ember.View.views = {};
}

export default function test(testName, callback) {
  function wrapper() {
    var context = getContext();

    resetViews();
    var result = callback.call(context);

    function failTestOnPromiseRejection(reason) {
      var message;
      if (reason instanceof Error) {
        message = reason.stack;
      } else {
        message = Ember.inspect(reason);
      }
      ok(false, message);
    }

    Ember.run(function(){
      QUnit.stop();
      Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
    });
  }

  QUnit.test(testName, wrapper);
}
