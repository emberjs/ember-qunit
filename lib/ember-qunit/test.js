import testWrapper from 'ember-qunit/test-wrapper';
import { test as qunitTest } from 'qunit';

export default function test(...args) {
  args.unshift(qunitTest);
  testWrapper.apply(null, args);
}
