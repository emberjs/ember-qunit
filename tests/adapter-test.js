/* global setTimeout */

import QUnit, { module, test} from "qunit";
import { QUnitAdapter } from "ember-qunit";

module("QUnitAdapter");

test("asyncStart waits for asyncEnd to finish a test", function(assert) {
  const adapter = QUnitAdapter.create();

  adapter.asyncStart();
  setTimeout(function() {
    assert.ok(true);
    adapter.asyncEnd();
  }, 50);
});

test("asyncStart waits for equal numbers of asyncEnd to finish a test", function(
  assert
) {
  const adapter = QUnitAdapter.create();

  adapter.asyncStart();
  adapter.asyncStart();
  adapter.asyncEnd();

  setTimeout(function() {
    assert.ok(true);
    adapter.asyncEnd();
  }, 50);
});

test("exception (nothing)", function(assert) {
  const adapter = QUnitAdapter.create();

  let count = 0;
  let pushedResult;

  let originalPushResult = QUnit.config.current.pushResult;
  try {
    QUnit.config.current.pushResult = function(result) {
      count++;
      pushedResult = result;
    };
    adapter.exception();
  } finally {
    QUnit.config.current.pushResult = originalPushResult;
  }

  assert.deepEqual(pushedResult, {
    result: false,
    actual: false,
    expected: true,
    message: "unhandledRejection occured, but it had no message",
    source: "unknown source"
  });

  assert.equal(count, 1);
});

test("exception (error)", function(assert) {
  const adapter = QUnitAdapter.create();
  const error = new Error("hi");

  let count = 0;
  let pushedResult;

  let originalPushResult = QUnit.config.current.pushResult;
  try {
    QUnit.config.current.pushResult = function(result) {
      count++;
      pushedResult = result;
    };
    adapter.exception(error);
  } finally {
    QUnit.config.current.pushResult = originalPushResult;
  }

  assert.deepEqual(pushedResult, {
    result: false,
    actual: false,
    expected: true,
    message: "hi",
    source: error.stack
  });

  assert.equal(count, 1);
});

test("exception (string)", function(assert) {
  const adapter = QUnitAdapter.create();
  const error = "hi";

  let count = 0;
  let pushedResult;

  let originalPushResult = QUnit.config.current.pushResult;
  try {
    QUnit.config.current.pushResult = function(result) {
      count++;
      pushedResult = result;
    };
    adapter.exception(error);
  } finally {
    QUnit.config.current.pushResult = originalPushResult;
  }

  assert.deepEqual(pushedResult, {
    result: false,
    actual: false,
    expected: true,
    message: "hi",
    source: "unknown source"
  });

  assert.equal(count, 1);
});
