import QUnit from 'qunit';
import getAssertionMessage from './get-assertion-message';

export default function strictEqual(actual, expected, message) {
  message = getAssertionMessage(actual, expected, message);
  QUnit.strictEqual.call(this, actual, expected, message);
}
