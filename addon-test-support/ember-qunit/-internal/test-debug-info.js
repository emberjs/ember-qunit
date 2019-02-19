import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';

const PENDING_AJAX_REQUESTS = 'Pending AJAX requests';
const PENDING_TEST_WAITERS = 'Pending test waiters';
const SCHEDULED_ASYNC = 'Scheduled async';
const SCHEDULED_AUTORUN = 'Scheduled autorun';

export function getDebugInfo() {
  let debugEnabled = run.backburner.DEBUG === true;
  let getDebugInfoAvailable = typeof run.backburner.getDebugInfo === 'function';

  return debugEnabled && getDebugInfoAvailable ? run.backburner.getDebugInfo() : null;
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
  constructor(module, name, settledState, debugInfo = getDebugInfo()) {
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
      this._summaryInfo = assign(
        {
          fullTestName: this.fullTestName,
        },
        this.settledState
      );

      if (this.debugInfo) {
        this._summaryInfo.autorunStackTrace =
          this.debugInfo.autorun && this.debugInfo.autorun.stack;
        this._summaryInfo.pendingTimersCount = this.debugInfo.timers.length;
        this._summaryInfo.hasPendingTimers =
          this._summaryInfo.hasPendingTimers && this._summaryInfo.pendingTimersCount > 0;
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

  get message() {
    return `\nMore information has been printed to the console. Please use that information to help in debugging.\n\n`;
  }

  toConsole(_console = console) {
    let summary = this.summary;

    _console.group(summary.fullTestName);

    if (summary.hasPendingRequests) {
      _console.log(PENDING_AJAX_REQUESTS);
    }

    if (summary.hasPendingWaiters) {
      _console.log(PENDING_TEST_WAITERS);
    }

    if (summary.hasPendingTimers || summary.pendingScheduledQueueItemCount > 0) {
      _console.group(SCHEDULED_ASYNC);

      summary.pendingTimersStackTraces.forEach(timerStack => {
        _console.log(timerStack);
      });

      summary.pendingScheduledQueueItemStackTraces.forEach(scheduleQueueItemStack => {
        _console.log(scheduleQueueItemStack);
      });

      _console.groupEnd();
    }

    if (
      summary.hasRunLoop &&
      summary.pendingTimersCount === 0 &&
      summary.pendingScheduledQueueItemCount === 0
    ) {
      _console.log(SCHEDULED_AUTORUN);

      if (summary.autorunStackTrace) {
        _console.log(summary.autorunStackTrace);
      }
    }

    _console.groupEnd();
  }

  _formatCount(title, count) {
    return `${title}: ${count}`;
  }
}
