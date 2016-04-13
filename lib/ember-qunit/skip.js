import testWrapper from 'ember-qunit/test-wrapper';
import { skip as qunitSkip } from 'qunit';

export default function skip(/* testName, expected, callback, async */) {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
    args[_key] = arguments[_key];
  }
  args.unshift(qunitSkip);
  testWrapper.apply(null, args);
}
