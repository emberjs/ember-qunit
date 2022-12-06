import type { test } from 'qunit';

/** Checks if the given value is a `Record<string, unknown>`. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

type TestBase = typeof test & { testId: string };

export type SkippedTest = TestBase & { skip: true; assert?: undefined };

export type AssertionTest = TestBase & { assert: Assert };

// FIXME: What is the appropriate Test type? There doesn't appear to be a test type exported from qunit
// https://github.com/qunitjs/qunit/blob/main/src/test.js#L23
export type Test = SkippedTest | AssertionTest;

export function isTest(value: unknown): value is Test {
  return typeof value === 'function' && 'testId' in value;
}
