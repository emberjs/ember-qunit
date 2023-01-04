import AbstractTestLoader, {
  addModuleExcludeMatcher,
  addModuleIncludeMatcher,
} from 'ember-cli-test-loader/test-support/index';
import * as QUnit from 'qunit';

addModuleExcludeMatcher(function (moduleName) {
  // @ts-expect-error FIXME Qunit types argh
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return QUnit.urlParams.nolint && /\.(jshint|lint-test)$/.test(moduleName);
});

addModuleIncludeMatcher(function (moduleName) {
  return moduleName.endsWith('.jshint');
});

let moduleLoadFailures: unknown[] = [];

QUnit.done(function () {
  const length = moduleLoadFailures.length;

  try {
    if (length === 0) {
      // do nothing
    } else if (length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw moduleLoadFailures[0];
    } else {
      throw new Error('\n' + moduleLoadFailures.join('\n'));
    }
  } finally {
    // ensure we release previously captured errors.
    moduleLoadFailures = [];
  }
});

export class TestLoader extends AbstractTestLoader {
  moduleLoadFailure(moduleName: string, error: unknown): void {
    moduleLoadFailures.push(error);

    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function () {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    });
  }
}

/**
   Load tests following the default patterns:

   * The module name ends with `-test`
   * The module name ends with `.jshint`

   Excludes tests that match the following
   patterns when `?nolint` URL param is set:

   * The module name ends with `.jshint`
   * The module name ends with `-lint-test`

   @method loadTests
 */
export function loadTests(): void {
  TestLoader.load();
}
