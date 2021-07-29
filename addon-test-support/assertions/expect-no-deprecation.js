import checkMatcher from './utils/check-matcher';
import {
  getDeprecations,
  getDeprecationsDuringCallback,
} from '@ember/test-helpers';

export default function expectNoDeprecation(cb, matcher) {
  const test = (deprecations, matcher) => {
    const matchedDeprecations = deprecations.filter((deprecation) => {
      return checkMatcher(deprecation.message, matcher);
    });

    this.pushResult({
      result: matchedDeprecations.length === 0,
      actual: matchedDeprecations,
      expected: [],
      message:
        'Expected no deprecations during test, but deprecations were found.',
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
