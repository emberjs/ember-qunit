import { module, test } from 'qunit';
import { QUnitAdapter, nonTestDoneCallback } from 'ember-qunit';
import patchAssert from './utils/patch-assert-helper';

const NATIVE_PROMISE = Promise;

import { Promise } from 'rsvp';

module('QUnitAdapter');

test('asyncStart waits for asyncEnd to finish a test', function(assert) {
  const adapter = QUnitAdapter.create();

  adapter.asyncStart();
  setTimeout(function() {
    assert.ok(true);
    adapter.asyncEnd();
  }, 50);
});

test('asyncStart waits for equal numbers of asyncEnd to finish a test', function(assert) {
  const adapter = QUnitAdapter.create();

  adapter.asyncStart();
  adapter.asyncStart();
  adapter.asyncEnd();

  setTimeout(function() {
    assert.ok(true);
    adapter.asyncEnd();
  }, 50);
});

test('asyncStart should handle skipped tests that has no assert', function(assert) {
  let FakeQUnitWithoutAssert = {
    config: {
      current: {},
    },
  };

  const adapter = QUnitAdapter.create({ qunit: FakeQUnitWithoutAssert });

  adapter.asyncStart();
  assert.equal(adapter.doneCallbacks.length, 1);
  assert.deepEqual(adapter.doneCallbacks, [
    {
      test: FakeQUnitWithoutAssert.config.current,
      done: nonTestDoneCallback,
    },
  ]);
});

module('QUnitAdapter - Balanced async with native Promise', function() {
  const adapter = QUnitAdapter.create();

  test('asyncStart invoked', function(assert) {
    adapter.asyncStart();

    assert.ok(true);

    patchAssert(assert);
    return NATIVE_PROMISE.reject('trolol');
  });

  test('asyncEnd invoked', function(assert) {
    assert.ok(true, 'fired!');
    setTimeout(() => {
      adapter.asyncEnd();
    });
  });
});

module('QUnitAdapter - Balanced async with RSVP.Promise', function() {
  const adapter = QUnitAdapter.create();

  test('asyncStart invoked', function(assert) {
    adapter.asyncStart();

    assert.ok(true);

    patchAssert(assert);
    return Promise.reject('trolol');
  });

  test('asyncEnd invoked', function(assert) {
    assert.ok(true, 'fired!');
    setTimeout(() => {
      adapter.asyncEnd();
    });
  });
});
