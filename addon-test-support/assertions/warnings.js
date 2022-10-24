import checkMatcher from './utils/check-matcher';

import { getWarnings, getWarningsDuringCallback } from '@ember/test-helpers';

export function expectNoWarning(callback) {
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

export function expectWarning(callback, matcher) {
  let warnings;
  if (typeof callback === 'function') {
    warnings = getWarningsDuringCallback(callback);
  } else {
    matcher = callback;
    warnings = getWarnings();
  }

  const actual = warnings.filter((warning) =>
    checkMatcher(warning.message, matcher)
  );

  const result = actual.length !== 0;
  this.pushResult({
    result,
    actual,
    expected: null,
    message: 'Expected warnings during test, but no warnings were found.',
  });
}
