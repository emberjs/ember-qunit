import QUnit from 'qunit';
import getAssertionMessage from './get-assertion-message';

export default function equal(actual, expected, message) {
  message = getAssertionMessage(actual, expected, message);
  QUnit.equal.call(this, actual, expected, message);
}
