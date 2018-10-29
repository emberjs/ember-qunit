const STACK = 'STACK';
export const debugInfo = {
  timers: [
    {
      stack: STACK,
    },
    {
      stack: STACK,
    },
  ],
  instanceStack: [
    {
      one: [
        {
          stack: STACK,
        },
      ],
      two: [
        {
          stack: STACK,
        },
      ],
    },
  ],
};

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

export function randomBoolean() {
  return Math.random() >= 0.5;
}

export function getSettledState(
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
