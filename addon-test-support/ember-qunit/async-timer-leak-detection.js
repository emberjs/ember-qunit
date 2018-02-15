import { run } from '@ember/runloop';
import { getSettledState } from '@ember/test-helpers';

const TESTS_WITH_LEAKY_ASYNC = [];

export function detectPendingTimers({ module, name }) {
  let { hasPendingTimers } = getSettledState();

  if (hasPendingTimers) {
    TESTS_WITH_LEAKY_ASYNC.push(`${module}: ${name}`);
    run.cancelTimers();
  }
}

export function reportPendingTimers() {
  if (TESTS_WITH_LEAKY_ASYNC.length > 0) {
    let leakyTests = TESTS_WITH_LEAKY_ASYNC.slice();
    TESTS_WITH_LEAKY_ASYNC.length = 0;

    throw new Error(
      `ASYNC LEAKAGE DETECTED IN TESTS
       The following (${leakyTests.length}) tests setup a timer that was never torn down before the test completed: \n
       ${leakyTests.join('\n')}
      `
    );
  }
}
