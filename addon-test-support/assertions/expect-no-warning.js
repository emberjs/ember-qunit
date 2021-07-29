import { getWarnings, getWarningsDuringCallback } from '@ember/test-helpers';

export default function expectNoWarning(callback) {
  const warnings =
    typeof callback === 'function'
      ? getWarningsDuringCallback(callback)
      : getWarnings();

  this.pushResult({
    result: warnings.length === 0,
    actual: warnings,
    expected: [],
    message: 'Expected no warnings during test, but warnings were found.',
  });
}
