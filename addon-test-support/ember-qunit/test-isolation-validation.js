import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { isSettled, getSettledState } from '@ember/test-helpers';
import TestDebugInfo from './-internal/test-debug-info';
import TestDebugInfoSummary from './-internal/test-debug-info-summary';
import getDebugInfoAvailable from './-internal/get-debug-info-available';

const { backburner } = run;
let nonIsolatedTests = new TestDebugInfoSummary();

/**
 * Detects if a specific test isn't isolated. A test is considered
 * not isolated if it:
 *
 * - has pending timers
 * - is in a runloop
 * - has pending AJAX requests
 * - has pending test waiters
 *
 * @function detectIfTestNotIsolated
 * @param {Object} testInfo
 * @param {string} testInfo.module The name of the test module
 * @param {string} testInfo.name The test name
 */
export function detectIfTestNotIsolated({ module, name }) {
  if (!isSettled()) {
    let testDebugInfo;
    let backburnerDebugInfo;

    if (getDebugInfoAvailable()) {
      backburnerDebugInfo = backburner.getDebugInfo();
    }

    testDebugInfo = new TestDebugInfo(module, name, getSettledState(), backburnerDebugInfo);

    nonIsolatedTests.add(testDebugInfo);
    run.cancelTimers();
  }
}

/**
 * Reports if a test isn't isolated. Please see above for what
 * constitutes a test being isolated.
 *
 * @function reportIfTestNotIsolated
 * @throws Error if tests are not isolated
 */
export function reportIfTestNotIsolated() {
  if (nonIsolatedTests.hasDebugInfo) {
    nonIsolatedTests.printToConsole();

    module('Non-isolated test detected', function() {
      nonIsolatedTests.forEach(testDebugInfo => {
        test(`Module: '${testDebugInfo.module}', Test: ${testDebugInfo.name}`, function(assert) {
          assert.expect(1);

          assert.pushResult({
            result: false,
            message: testDebugInfo.toString(),
          });
        });
      });
    });

    nonIsolatedTests = new TestDebugInfoSummary();
  }
}
