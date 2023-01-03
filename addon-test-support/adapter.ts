import { assert } from '@ember/debug';
import type EmberTestAdapter from '@ember/test/adapter';
import hasEmberVersion from '@ember/test-helpers/has-ember-version';
import Ember from 'ember';

import * as QUnit from 'qunit';

import { isRecord, isTest } from './types/util';

function unhandledRejectionAssertion(current: unknown, error: unknown): void {
  let message: string;
  let source: string | undefined;

  if (
    isRecord(error) &&
    'message' in error &&
    typeof error['message'] === 'string'
  ) {
    message = error['message'];
    source = typeof error['stack'] === 'string' ? error['stack'] : undefined;
  } else if (typeof error === 'string') {
    message = error;
    source = 'unknown source';
  } else {
    message = 'unhandledRejection occurred, but it had no message';
    source = 'unknown source';
  }

  assert(
    'expected current test to have an assert',
    isTest(current) && 'assert' in current
  );
  current.assert.pushResult({
    result: false,
    actual: false,
    expected: true,
    message: message,
    // @ts-expect-error FIXME: Update qunit type https://github.com/qunitjs/qunit/blob/fc278e8c0d7e90ec42e47b47eee1cc85c9a9efaf/docs/callbacks/QUnit.log.md?plain=1#L32
    source,
  });
}

export function nonTestDoneCallback(): void {
  // no-op
}

interface QUnitAdapter extends EmberTestAdapter {
  doneCallbacks: Array<{ test: unknown; done: () => void }>;
  qunit: QUnit;
}

// @ts-expect-error FIXME `extend` does not exist on Adapter
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
let Adapter = Ember.Test.Adapter.extend({
  init(this: QUnitAdapter) {
    this.doneCallbacks = [];
    this.qunit ??= QUnit;
  },

  asyncStart(this: QUnitAdapter) {
    const currentTest: unknown = this.qunit.config.current;
    const done =
      isTest(currentTest) && 'assert' in currentTest
        ? currentTest.assert.async()
        : nonTestDoneCallback;
    this.doneCallbacks.push({ test: currentTest, done });
  },

  asyncEnd(this: QUnitAdapter) {
    const currentCallback = this.doneCallbacks.pop();

    if (!currentCallback) {
      throw new Error(
        'Adapter asyncEnd called when no async was expected. Please create an issue in ember-qunit.'
      );
    }

    const { test, done } = currentCallback;

    // In future, we should explore fixing this at a different level, specifically
    // addressing the pairing of asyncStart/asyncEnd behavior in a more consistent way.
    if (test === this.qunit.config.current) {
      done();
    }
  },

  // clobber default implementation of `exception` will be added back for Ember
  // < 2.17 just below...
  exception: null,
}) as QUnitAdapter;

// Ember 2.17 and higher do not require the test adapter to have an `exception`
// method When `exception` is not present, the unhandled rejection is
// automatically re-thrown and will therefore hit QUnit's own global error
// handler (therefore appropriately causing test failure)
if (!hasEmberVersion(2, 17)) {
  // @ts-expect-error FIXME `extend` does not exist on Adapter
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  Adapter = Adapter.extend({
    exception(error: unknown) {
      const currentTest: unknown = QUnit.config.current;
      unhandledRejectionAssertion(currentTest, error);
    },
  }) as QUnitAdapter;
}

export default Adapter;
