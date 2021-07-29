import {
  run,
  end,
  _getCurrentRunLoop,
  _hasScheduledTimers,
  _cancelTimers,
} from '@ember/runloop';

function getCurrentRunLoop() {
  // Ember 3.24.4 does not have _getCurrentRunLoop, but does have run.currentRunLoop;
  if ('currentRunLoop' in run) {
    return run.currentRunLoop;
  } else {
    return _getCurrentRunLoop();
  }
}

// TODO: It seems very odd to mix runloop + timers into a runloop
// specific assertion.
//
// We should likely:
//
// * have timer specific expectations
// * have runloop specific expectations
// * not have either cancel timers or runloop, rather those should
//   be the explicitly choosen by the user
export default function expectNoRunloop() {
  if (getCurrentRunLoop()) {
    this.pushResult({
      result: false,
      actual: getCurrentRunLoop(),
      expected: null,
      message: 'expected no active runloop',
    });

    while (getCurrentRunLoop()) {
      end();
    }
  } else {
    this.pushResult({
      result: true,
      actual: null,
      expected: null,
      message: 'expected no active runloop',
    });
  }

  if (_hasScheduledTimers()) {
    this.pushResult({
      result: false,
      actual: true,
      expected: false,
      message: 'expected no active timers',
    });

    _cancelTimers();
  } else {
    this.pushResult({
      result: true,
      actual: false,
      expected: false,
      message: 'expected no active timers',
    });
  }
}
