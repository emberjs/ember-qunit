import {
  getDeprecationsDuringCallback,
  getDeprecations,
} from '@ember/test-helpers';
import checkMatcher from './utils/check-matcher';

export default function expectDeprecation(cb, matcher) {
  const test = (deprecations, matcher) => {
    const matchedDeprecations = deprecations.filter((deprecation) => {
      return checkMatcher(deprecation.message, matcher);
    });

    this.pushResult({
      result: matchedDeprecations.length !== 0,
      actual: matchedDeprecations,
      expected: null,
      message:
        'Expected deprecations during test, but no deprecations were found.',
    });
  };

  if (typeof cb !== 'function') {
    // cb is not a callback, so we assume it is the matcher
    test(getDeprecations(), cb);
  } else {
    const maybeThenable = getDeprecationsDuringCallback(cb);
    if (
      maybeThenable !== null &&
      typeof maybeThenable === 'object' &&
      typeof maybeThenable.then === 'function'
    ) {
      return maybeThenable.then((deprecations) => test(deprecations, matcher));
    } else {
      test(maybeThenable, matcher);
    }
  }
}
