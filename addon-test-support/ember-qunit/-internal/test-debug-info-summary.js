const PENDING_REQUESTS = 'Pending AJAX requests';
const PENDING_TEST_WAITERS = 'Pending test waiters: YES';
const PENDING_TIMERS = 'Pending timers';
const PENDING_SCHEDULED_ITEMS = 'Pending scheduled items';
const ACTIVE_RUNLOOPS = 'Active runloops: YES';

export function getSummary(testCounts, leakCounts, testNames) {
  let leakInfo =
    leakCounts.length > 0
      ? `We found the following information that may help you identify code that violated test isolation: \n
  ${leakCounts.join('\n')}
   \n`
      : '';
  let summary = `TESTS ARE NOT ISOLATED\n
 The following ${testCounts} test(s) have one or more issues that are resulting in non-isolation (async execution is extending beyond the duration of the test):\n
 ${testNames.join('\n')}
\n
 ${leakInfo}
 More information has been printed to the console. Please use that information to help in debugging.
`;

  return summary;
}

export default class TestDebugInfoSummary {
  constructor() {
    this._testDebugInfos = [];
    this.fullTestNames = [];
    this.hasPendingRequests = false;
    this.hasPendingWaiters = false;
    this.hasRunLoop = false;
    this.hasPendingTimers = false;
    this.hasPendingScheduledQueueItems = false;
    this.totalPendingRequestCount = 0;
    this.totalPendingTimersCount = 0;
    this.totalPendingScheduledQueueItemCount = 0;
  }

  add(testDebugInfo) {
    let summary = testDebugInfo.summary;

    this._testDebugInfos.push(testDebugInfo);

    this.fullTestNames.push(summary.fullTestName);
    if (summary.hasPendingRequests) {
      this.hasPendingRequests = true;
    }
    if (summary.hasPendingWaiters) {
      this.hasPendingWaiters = true;
    }
    if (summary.hasRunLoop) {
      this.hasRunLoop = true;
    }
    if (summary.hasPendingTimers) {
      this.hasPendingTimers = true;
    }
    if (summary.pendingScheduledQueueItemCount > 0) {
      this.hasPendingScheduledQueueItems = true;
    }

    this.totalPendingRequestCount += summary.pendingRequestCount;
    this.totalPendingTimersCount += summary.pendingTimersCount;
    this.totalPendingScheduledQueueItemCount += summary.pendingScheduledQueueItemCount;
  }

  get hasDebugInfo() {
    return this._testDebugInfos.length > 0;
  }

  printToConsole(_console = console) {
    _console.group('Tests not isolated');

    this._testDebugInfos.forEach(testDebugInfo => {
      let summary = testDebugInfo.summary;

      _console.group(summary.fullTestName);

      if (summary.hasPendingRequests) {
        _console.log(this.formatCount(PENDING_REQUESTS, summary.pendingRequestCount));
      }

      if (summary.hasPendingWaiters) {
        _console.log(PENDING_TEST_WAITERS);
      }

      if (summary.hasPendingTimers) {
        _console.group(this.formatCount(PENDING_TIMERS, summary.pendingTimersCount));
        summary.pendingTimersStackTraces.forEach(stackTrace => {
          _console.log(stackTrace);
        });
        _console.groupEnd();
      }

      if (summary.hasPendingScheduledQueueItems) {
        _console.group(
          this.formatCount(PENDING_SCHEDULED_ITEMS, summary.pendingScheduledQueueItemCount)
        );
        summary.pendingScheduledQueueItemStackTraces.forEach(stackTrace => {
          _console.log(stackTrace);
        });
        _console.groupEnd();
      }

      if (summary.hasRunLoop) {
        _console.log(ACTIVE_RUNLOOPS);
      }

      _console.groupEnd();
    });

    _console.groupEnd();
  }

  formatForBrowser() {
    let leakCounts = [];

    if (this.hasPendingRequests) {
      leakCounts.push(this.formatCount(PENDING_REQUESTS, this.totalPendingRequestCount));
    }

    if (this.hasPendingWaiters) {
      leakCounts.push(PENDING_TEST_WAITERS);
    }

    if (this.hasPendingTimers) {
      leakCounts.push(this.formatCount(PENDING_TIMERS, this.totalPendingTimersCount));
    }

    if (this.hasPendingScheduledQueueItems) {
      leakCounts.push(
        this.formatCount(PENDING_SCHEDULED_ITEMS, this.totalPendingScheduledQueueItemCount)
      );
    }

    if (this.hasRunLoop) {
      leakCounts.push(ACTIVE_RUNLOOPS);
    }

    return getSummary(this._testDebugInfos.length, leakCounts, this.fullTestNames);
  }

  formatCount(title, count) {
    return `${title}: ${count}`;
  }
}
