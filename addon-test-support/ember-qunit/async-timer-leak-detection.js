export function detectPendingTimers(
  hasPendingTimers,
  pendingTimers,
  testModule,
  testName,
  cancelTimers
) {
  if (hasPendingTimers) {
    pendingTimers.push(`${testModule}: ${testName}`);
    cancelTimers();
  }
}

export function reportPendingTimers(pendingTimers) {
  if (pendingTimers.length > 0) {
    throw new Error(
      `ASYNC LEAKAGE DETECTED IN TESTS
       The following (${pendingTimers.length}) tests setup a timer that was never torn down before the test completed: \n
       ${pendingTimers.join('\n')}
      `
    );
  }
}
