import * as QUnit from 'qunit';

/* globals requirejs, require */

class TestLoader {
  static load() {
    new TestLoader().loadModules();
  }
  constructor() {
    this._didLogMissingUnsee = false;
  }
  shouldLoadModule(moduleName) {
    return moduleName.match(/[-_]test$/);
  }
  listModules() {
    return Object.keys(requirejs.entries);
  }
  listTestModules() {
    let moduleNames = this.listModules();
    let testModules = [];
    let moduleName;
    for (let i = 0; i < moduleNames.length; i++) {
      moduleName = moduleNames[i];
      if (this.shouldLoadModule(moduleName)) {
        testModules.push(moduleName);
      }
    }
    return testModules;
  }
  loadModules() {
    let testModules = this.listTestModules();
    let testModule;
    for (let i = 0; i < testModules.length; i++) {
      testModule = testModules[i];
      this.require(testModule);
      this.unsee(testModule);
    }
  }
  require(moduleName) {
    try {
      require(moduleName);
    } catch (e) {
      this.moduleLoadFailure(moduleName, e);
    }
  }
  unsee(moduleName) {
    if (typeof require.unsee === 'function') {
      require.unsee(moduleName);
    } else if (!this._didLogMissingUnsee) {
      this._didLogMissingUnsee = true;
      if (typeof console !== 'undefined') {
        console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
      }
    }
  }
  moduleLoadFailure(moduleName, error) {
    moduleLoadFailures.push(error);
    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function () {
      throw error;
    });
  }
}
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
