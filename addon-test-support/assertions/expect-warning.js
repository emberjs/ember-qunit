import checkMatcher from './utils/check-matcher';
import { getWarningsDuringCallback, getWarnings } from '@ember/test-helpers';

export default function expectWarning(callback, matcher) {
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
