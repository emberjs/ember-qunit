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
      this._summaryInfo = Object.assign(
        {
          fullTestName: this.fullTestName,
        },
        this.settledState
      );

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
}
