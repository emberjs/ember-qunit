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
      Ember.RSVP.Promise.resolve(result)['catch'](failTestOnPromiseRejection)['finally'](QUnit.start);
    });
  }

  qunitTest(testName, wrapper);
}
