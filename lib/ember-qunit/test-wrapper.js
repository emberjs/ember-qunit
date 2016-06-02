import Ember from 'ember';
import { getContext } from 'ember-test-helpers';

export default function testWrapper(qunit /*, testName, expected, callback, async */) {
  var callback;
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; ++_key) {
    args[_key - 1] = arguments[_key];
  }

  function wrapper() {
    var context = getContext();

    var result = callback.apply(context, arguments);

    function failTestOnPromiseRejection(reason) {
      var message;
      if (reason instanceof Error) {
        message = reason.stack;
        if (reason.message && message && message.indexOf(reason.message) < 0) {
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

  if (args.length === 2) {
    callback = args.splice(1, 1, wrapper)[0];
  } else {
    callback = args.splice(2, 1, wrapper)[0];
  }

  qunit.apply(null, args);
}
