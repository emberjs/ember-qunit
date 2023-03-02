import type { Test } from 'qunit';

/** Checks if the given value is a `Record<string, unknown>`. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

export function isTest(value: unknown): value is Test {
  return isRecord(value) && 'testId' in value;
}
