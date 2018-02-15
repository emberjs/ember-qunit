import { run } from '@ember/runloop';
import { isSettled } from '@ember/test-helpers';

const TESTS_NOT_SETTLED = [];

/**
 * Detects if a specific test hasn't reached the settled state. A test is considered
 * settled if it:
 *
 * - has no pending timers
 * - is not in a runloop
 * - has no pending AJAX requests
 * - has no pending test waiters
 *
 * @param {Object} testInfo
 * @param {string} testInfo.module The name of the test module
 * @param {string} testInfo.name The test name
 */
export function detectIfNotSettled({ module, name }) {
  if (!isSettled()) {
    TESTS_NOT_SETTLED.push(`${module}: ${name}`);
    run.cancelTimers();
  }
}

/**
 * Reports if a test is not considered settled. Please see above for what
 * constitutes settledness.
 *
 * @throws Error if tests have not settled
 */
export function reportIfNotSettled() {
  if (TESTS_NOT_SETTLED.length > 0) {
    let leakyTests = TESTS_NOT_SETTLED.slice();
    TESTS_NOT_SETTLED.length = 0;

    throw new Error(getMessage(leakyTests.length, leakyTests.join('\n')));
  }
}

export function getMessage(testCount, testsToReport) {
  return `TESTS HAVE UNSETTLED ASYNC BEHAVIOR
    The following (${testCount}) tests have one or more of pending timers, pending AJAX requests, pending test waiters, or are still in a runloop: \n
    ${testsToReport}
  `;
}
