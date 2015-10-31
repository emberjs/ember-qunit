import Ember from 'ember';
import { getContext } from 'ember-test-helpers';

export default function testWrapper(testName, callback, qunit) {
  function wrapper(assert) {
    var context = getContext();

    var result = callback.call(context, assert);

    function failTestOnPromiseRejection(reason) {
      var message;
      if (reason instanceof Error) {
        message = reason.stack;
        if (reason.message && message.indexOf(reason.message) < 0) {
          // PhantomJS has a `stack` that does not contain the actual
          // exception message.
          message = Ember.inspect(reason) + "\n" + message;
        }
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

  qunit(testName, wrapper);
}
