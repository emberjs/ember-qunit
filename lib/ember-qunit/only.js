import testWrapper from 'ember-qunit/test-wrapper';
import { only as qunitOnly } from 'qunit';

export default function only(...args) {
  args.unshift(qunitOnly);
  testWrapper.apply(null, args);
}
