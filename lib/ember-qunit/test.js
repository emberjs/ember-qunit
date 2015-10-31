import testWrapper from 'ember-qunit/test-wrapper';
import { test as qunitTest } from 'qunit';

export default function test(testName, callback) {
  testWrapper(testName, callback, qunitTest);
}
