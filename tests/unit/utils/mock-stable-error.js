/* eslint-disable no-global-assign */
/* eslint-disable no-unused-vars */

const ERROR = Error;

Error = ERROR;

export function overrideError(_Error) {
  Error = _Error;
}
export function resetError() {
  Error = ERROR;
}
export default class MockStableError {
  constructor(message) {}
  get stack() {
    return 'STACK';
  }
}
