import testWrapper from 'ember-qunit/test-wrapper';
import { test as qunitTest } from 'qunit';

export default function test(/* testName, expected, callback, async */) {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; ++_key) {
    args[_key] = arguments[_key];
  }
  args.unshift(qunitTest);
  testWrapper.apply(null, args);
}
