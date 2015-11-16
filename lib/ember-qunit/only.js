import testWrapper from 'ember-qunit/test-wrapper';
import { only as qunitOnly } from 'qunit';

export default function only(/* testName, expected, callback, async */) {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
    args[_key] = arguments[_key];
  }
  args.unshift(qunitOnly);
  testWrapper.apply(null, args);
}
