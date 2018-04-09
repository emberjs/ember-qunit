import { run } from '@ember/runloop';
import { isSettled } from '@ember/test-helpers';

const TESTS_NOT_ISOLATED = [];

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
    TESTS_NOT_ISOLATED.push(`${module}: ${name}`);
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
  if (TESTS_NOT_ISOLATED.length > 0) {
    let leakyTests = TESTS_NOT_ISOLATED.slice();
    TESTS_NOT_ISOLATED.length = 0;

    throw new Error(getMessage(leakyTests.length, leakyTests.join('\n')));
  }
}

export function getMessage(testCount, testsToReport) {
  return `TESTS ARE NOT ISOLATED
    The following (${testCount}) tests have one or more of pending timers, pending AJAX requests, pending test waiters, or are still in a runloop: \n
    ${testsToReport}
  `;
}
