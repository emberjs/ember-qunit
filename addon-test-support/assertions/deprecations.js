import { getDeprecationsDuringCallback } from '@ember/test-helpers';

export default async function deprecations(callback, expectedDeprecations) {
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
    operation(await maybeThenable);
  } else {
    operation(maybeThenable);
  }
}
