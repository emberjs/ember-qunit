import testWrapper from 'ember-qunit/test-wrapper';
import { skip as qunitSkip } from 'qunit';

export default function skip(...args) {
  args.unshift(qunitSkip);
  testWrapper.apply(null, args);
}
