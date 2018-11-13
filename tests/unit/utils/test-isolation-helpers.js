const STACK = 'STACK';

export class MockConsole {
  constructor() {
    this._buffer = [];
  }

  group(str) {
    this._buffer.push(str);
  }

  log(str) {
    this._buffer.push(str);
  }

  groupEnd() {}

  toString() {
    return this._buffer.join('\n');
  }
}

export function getRandomBoolean() {
  return Math.random() >= 0.5;
}

export function getMockDebugInfo(autorun = null, timersCount = 0, queues) {
  let debugInfo = {};
  let queueItem = { stack: STACK };

  if (autorun) {
    debugInfo.autorun = autorun;
  }

  debugInfo.timers = Array(timersCount).fill(queueItem, 0, timersCount);

  let instanceStack = {};
  debugInfo.instanceStack = [instanceStack];

  queues &&
    queues.forEach(queue => {
      instanceStack[queue.name] = Array(queue.count).fill(queueItem, 0, queue.count);
    });

  return debugInfo;
}

export function getMockSettledState(
  hasPendingTimers = false,
  hasRunLoop = false,
  hasPendingWaiters = false,
  hasPendingRequests = false,
  pendingRequestCount = 0
) {
  return {
    hasPendingTimers,
    hasRunLoop,
    hasPendingWaiters,
    hasPendingRequests,
    pendingRequestCount,
  };
}
