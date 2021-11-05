import {
  getDeprecationsDuringCallback,
  getDeprecations,
} from '@ember/test-helpers';
import checkMatcher from './utils/check-matcher';

export function deprecationsInclude(expected) {
  const deprecations = getDeprecations().map(
    (deprecation) => deprecation.message
  );

  this.pushResult({
    result: deprecations.indexOf(expected) > -1,
    actual: deprecations,
    message: `expected to find \`${expected}\` deprecation`,
  });
}

export function expectDeprecations(callback, expectedDeprecations) {
  const maybeThenable = getDeprecationsDuringCallback(callback);

  const operation = (deprecations) => {
    this.deepEqual(
      deprecations.map((deprecation) => deprecation.message),
      expectedDeprecations,
      'Expected deprecations during test.'
    );
  };

  if (
    typeof maybeThenable === 'object' &&
    maybeThenable !== null &&
    typeof maybeThenable.then === 'function'
  ) {
    return maybeThenable.then(operation);
  } else {
    operation(maybeThenable);
  }
}

export function expectDeprecation(cb, matcher) {
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

export function expectNoDeprecation(cb, matcher) {
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
