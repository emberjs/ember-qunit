import * as QUnit from 'qunit';
import AbstractTestLoader, { addModuleIncludeMatcher } from 'ember-cli-test-loader/test-support/index';

addModuleIncludeMatcher(function (moduleName) {
  return moduleName.match(/\.jshint$/);
});
let moduleLoadFailures = [];
QUnit.done(function () {
  let length = moduleLoadFailures.length;
  try {
    if (length === 0) {
      // do nothing
    } else if (length === 1) {
      throw moduleLoadFailures[0];
    } else {
      throw new Error('\n' + moduleLoadFailures.join('\n'));
    }
  } finally {
    // ensure we release previously captured errors.
    moduleLoadFailures = [];
  }
});
class TestLoader extends AbstractTestLoader {
  moduleLoadFailure(moduleName, error) {
    moduleLoadFailures.push(error);
    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function () {
      throw error;
    });
  }
}

/**
   Load tests following the default patterns:

   * The module name ends with `-test`

   @method loadTests
 */
function loadTests() {
  new TestLoader().loadModules();
}

export { TestLoader, loadTests };
//# sourceMappingURL=test-loader.js.map
