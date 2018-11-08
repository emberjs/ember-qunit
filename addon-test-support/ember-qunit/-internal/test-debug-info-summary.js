import formatCount from './format-count';

const PENDING_REQUESTS = 'Pending AJAX requests';
const PENDING_TEST_WAITERS = 'Pending test waiters: YES';
const PENDING_TIMERS = 'Pending timers';
const PENDING_SCHEDULED_ITEMS = 'Pending scheduled items';
const ACTIVE_RUNLOOPS = 'Active runloops: YES';

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

  forEach(fn) {
    this._testDebugInfos.forEach(fn);
  }

  printToConsole(_console = console) {
    _console.group('Tests not isolated');

    this._testDebugInfos.forEach(testDebugInfo => {
      let summary = testDebugInfo.summary;

      _console.group(summary.fullTestName);

      if (summary.hasPendingRequests) {
        _console.log(formatCount(PENDING_REQUESTS, summary.pendingRequestCount));
      }

      if (summary.hasPendingWaiters) {
        _console.log(PENDING_TEST_WAITERS);
      }

      if (summary.hasPendingTimers) {
        _console.group(formatCount(PENDING_TIMERS, summary.pendingTimersCount));
        summary.pendingTimersStackTraces.forEach(stackTrace => {
          _console.log(stackTrace);
        });
        _console.groupEnd();
      }

      if (summary.hasPendingScheduledQueueItems) {
        _console.group(
          formatCount(PENDING_SCHEDULED_ITEMS, summary.pendingScheduledQueueItemCount)
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
}
