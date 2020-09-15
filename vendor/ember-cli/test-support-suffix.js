/*
  used to determine if the application should be booted immediately when `app-name.js` is evaluated
  when `runningTests` the `app-name.js` file will **not** import the applications `app/app.js` and
  call `Application.create(...)` on it. Additionally, applications can opt-out of this behavior by
  setting `autoRun` to `false` in their `ember-cli-build.js`
*/
runningTests = true;

/*
  This file overrides a file built into ember-cli's build pipeline and prevents
  this built-in `Testem.hookIntoTestFramework` invocation:

  https://github.com/ember-cli/ember-cli/blob/v3.20.0/lib/broccoli/test-support-suffix.js#L3-L5
*/
