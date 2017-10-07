import QUnit from 'qunit';
import AbstractTestLoader, {
  addModuleExcludeMatcher,
  addModuleIncludeMatcher,
} from 'ember-cli-test-loader/test-support/index';

addModuleExcludeMatcher(function(moduleName) {
  return QUnit.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/);
});

addModuleIncludeMatcher(function(moduleName) {
  return moduleName.match(/\.jshint$/);
});

let moduleLoadFailures = [];

QUnit.done(function() {
  if (moduleLoadFailures.length) {
    throw new Error('\n' + moduleLoadFailures.join('\n'));
  }
});

export class TestLoader extends AbstractTestLoader {
  moduleLoadFailure(moduleName, error) {
    moduleLoadFailures.push(error);

    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function() {
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
export function loadTests() {
  new TestLoader().loadModules();
}
