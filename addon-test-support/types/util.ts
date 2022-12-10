/** Checks if the given value is a `Record<string, unknown>`. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

type Hook = (assert: Assert) => void | Promise<void>;

type TestCallback = (assert: Assert) => void | Promise<void>;

// https://github.com/qunitjs/qunit/blob/fc278e8c0d7e90ec42e47b47eee1cc85c9a9efaf/src/core/config.js#L84
interface Module {
  name: string;
  tests: Array<{ name: string; id: string; skip: boolean }>;
  childModules: Module[]; // FIXME: verify
  testsRun: number;
  testsIgnored: number;
  hooks: {
    before: Hook[];
    beforeEach: Hook[];
    afterEach: Hook[];
    after: Hook[];
  };
  skip?: boolean;
  ignored?: boolean;
}

// FIXME: What is the appropriate Test type? There doesn't appear to be a test type exported from qunit
// https://github.com/qunitjs/qunit/blob/main/src/test.js#L23
interface TestBase {
  testId: string;
  testName: string;
  expected: null | number;
  assertions: Array<{ result: boolean; message: string }>;
  module: Module;
  steps: unknown[];
  timeout: undefined;
  data: unknown;
  withData: boolean;
  pauses: Map<string, unknown>;
  nextPauseId: 1;
  stackOffset: 0 | 1 | 2 | 3 | 5;
  errorForStack: Error;
  testReport: unknown;
  stack: string;
  before: () => unknown;
  run: () => unknown;
  after: () => void;
  queueGlobalHook: (hook: unknown, hookName: unknown) => () => unknown;
  queueHook: (
    hook: unknown,
    hookName: unknown,
    hookOwner: unknown
  ) => () => unknown;
  hooks: (handler: unknown) => unknown;
  finish: () => unknown;
  preserveTestEnvironment: () => unknown;
  queue: () => void;
  pushResult: (resultInfo: unknown) => void;
  pushFailure: (message: string, source: string, actual: unknown) => void;
  skip?: true;
  callback: TestCallback;
  todo?: boolean;
  async?: boolean;
}

export interface AssertionTest extends TestBase {
  assert: Assert;
}

export interface SkipTest extends TestBase {
  skip: true;
  async: false;
}
export interface TodoTest extends TestBase {
  todo: true;
  assert: Assert;
}

export type Test = AssertionTest | SkipTest | TodoTest;

export function isTest(value: unknown): value is Test {
  return isRecord(value) && 'testId' in value;
}
