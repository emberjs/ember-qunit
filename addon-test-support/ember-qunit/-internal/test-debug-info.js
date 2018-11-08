import formatCount from './format-count';

const PENDING_REQUESTS = 'Pending AJAX requests';
const PENDING_TEST_WAITERS = 'Pending test waiters: YES';
const PENDING_TIMERS = 'Pending timers';
const PENDING_SCHEDULED_ITEMS = 'Pending scheduled items';
const ACTIVE_RUNLOOPS = 'Active runloops: YES';

export function getSummary(testName, leakCounts) {
  let leakInfo =
    leakCounts.length > 0
      ? `We found the following information that may help you identify code that violated test isolation:
 ${leakCounts.map(count => `- ${count}`).join('\n')}\n`
      : '\n';
  let summary = `'${testName}' is not isolated.\n
 This test has one or more issues that are resulting in non-isolation (async execution is extending beyond the duration of the test).\n
 ${leakInfo}
 More information has been printed to the console. Please use that information to help in debugging.\n
`;

  return summary;
}

/**
 * Encapsulates debug information for an individual test. Aggregates information
 * from:
 * - the test info provided by qunit (module & name)
 * - info provided by @ember/test-helper's getSettledState function
 *    - hasPendingTimers
 *    - hasRunLoop
 *    - hasPendingWaiters
 *    - hasPendingRequests
 *    - pendingRequestCount
 * - info provided by backburner's getDebugInfo method (timers, schedules, and stack trace info)
 */
export default class TestDebugInfo {
  constructor(module, name, settledState, debugInfo) {
    this.module = module;
    this.name = name;
    this.settledState = settledState;
    this.debugInfo = debugInfo;
  }

  get fullTestName() {
    return `${this.module}: ${this.name}`;
  }

  get summary() {
    if (!this._summaryInfo) {
      this._summaryInfo = Object.assign({ fullTestName: this.fullTestName }, this.settledState);

      if (this.debugInfo) {
        this._summaryInfo.pendingTimersCount = this.debugInfo.timers.length;
        this._summaryInfo.pendingTimersStackTraces = this.debugInfo.timers.map(
          timer => timer.stack
        );
        this._summaryInfo.pendingScheduledQueueItemCount = this.debugInfo.instanceStack
          .filter(q => q)
          .reduce((total, item) => {
            Object.keys(item).forEach(queueName => {
              total += item[queueName].length;
            });

            return total;
          }, 0);
        this._summaryInfo.pendingScheduledQueueItemStackTraces = this.debugInfo.instanceStack
          .filter(q => q)
          .reduce((stacks, deferredActionQueues) => {
            Object.keys(deferredActionQueues).forEach(queue => {
              deferredActionQueues[queue].forEach(
                queueItem => queueItem.stack && stacks.push(queueItem.stack)
              );
            });
            return stacks;
          }, []);
      }
    }

    return this._summaryInfo;
  }

  toString() {
    let leakCounts = [];

    if (this.summary.hasPendingRequests) {
      leakCounts.push(formatCount(PENDING_REQUESTS, this.summary.pendingRequestCount));
    }

    if (this.summary.hasPendingWaiters) {
      leakCounts.push(PENDING_TEST_WAITERS);
    }

    if (this.summary.hasPendingTimers) {
      leakCounts.push(formatCount(PENDING_TIMERS, this.summary.pendingTimersCount));
    }

    if (this.summary.hasPendingScheduledQueueItems) {
      leakCounts.push(
        formatCount(PENDING_SCHEDULED_ITEMS, this.summary.pendingScheduledQueueItemCount)
      );
    }

    if (this.summary.hasRunLoop) {
      leakCounts.push(ACTIVE_RUNLOOPS);
    }

    return getSummary(this.fullTestName, leakCounts);
  }
}
