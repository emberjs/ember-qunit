import { getDeprecations } from '@ember/test-helpers';

export default function deprecationsInclude(expected) {
  const deprecations = getDeprecations().map(
    (deprecation) => deprecation.message
  );

  this.pushResult({
    result: deprecations.indexOf(expected) > -1,
    actual: deprecations,
    message: `expected to find \`${expected}\` deprecation`,
  });
}
