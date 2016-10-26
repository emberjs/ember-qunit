# Change Log

## [v1.0.0](https://github.com/emberjs/ember-qunit/tree/v1.0.0) (2016-10-26)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v1.0.0-beta.1...v1.0.0)

**Closed issues:**

- Move repo to emberjs org. [\#242](https://github.com/emberjs/ember-qunit/issues/242)
- Polymorphic relationships via mixin break tests [\#240](https://github.com/emberjs/ember-qunit/issues/240)
- ember-test-helpers uses Ember.merge which is deprecated [\#221](https://github.com/emberjs/ember-qunit/issues/221)
- Problems with moduleForComponent and testing div ID [\#40](https://github.com/emberjs/ember-qunit/issues/40)

**Merged pull requests:**

- Make Qunit module available as 'ember-qunit' export [\#245](https://github.com/emberjs/ember-qunit/pull/245) ([zzarcon](https://github.com/zzarcon))
- Add 'phantomjs-prebuilt' to dev dependency in order to make test work locally [\#244](https://github.com/emberjs/ember-qunit/pull/244) ([zzarcon](https://github.com/zzarcon))
- Use emberjs org name instead of rwjblue [\#243](https://github.com/emberjs/ember-qunit/pull/243) ([zzarcon](https://github.com/zzarcon))
- Super minor readme typo [\#241](https://github.com/emberjs/ember-qunit/pull/241) ([derekdowling](https://github.com/derekdowling))

## [v1.0.0-beta.1](https://github.com/emberjs/ember-qunit/tree/v1.0.0-beta.1) (2016-08-17)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.22...v1.0.0-beta.1)

**Merged pull requests:**

- Upgrade QUnit to 2.0 [\#234](https://github.com/emberjs/ember-qunit/pull/234) ([trentmwillis](https://github.com/trentmwillis))

## [v0.4.22](https://github.com/emberjs/ember-qunit/tree/v0.4.22) (2016-08-17)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.21...v0.4.22)

**Merged pull requests:**

- Respect beforeEach and afterEach hooks returning promises [\#239](https://github.com/emberjs/ember-qunit/pull/239) ([trentmwillis](https://github.com/trentmwillis))
- Add CHANGELOG file [\#236](https://github.com/emberjs/ember-qunit/pull/236) ([Turbo87](https://github.com/Turbo87))

## [v0.4.21](https://github.com/emberjs/ember-qunit/tree/v0.4.21) (2016-08-16)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.20...v0.4.21)

**Closed issues:**

- moduleFor & friends: Support nested modules as provided by QUnit.module [\#232](https://github.com/emberjs/ember-qunit/issues/232)
- can't use Qunit's new before and after hooks [\#229](https://github.com/emberjs/ember-qunit/issues/229)
- reason without stack but with message will error [\#227](https://github.com/emberjs/ember-qunit/issues/227)
- Inconsistent Mixin testing behavior [\#226](https://github.com/emberjs/ember-qunit/issues/226)
- Singletons are not destroyed between integration tests [\#222](https://github.com/emberjs/ember-qunit/issues/222)
- Integration test method to "destroy" the component [\#217](https://github.com/emberjs/ember-qunit/issues/217)
- Triggering ember custom event such as paste in component integration test [\#214](https://github.com/emberjs/ember-qunit/issues/214)
- No moduleForHelper [\#76](https://github.com/emberjs/ember-qunit/issues/76)

**Merged pull requests:**

- Use QUnit's test context with ember-test-helpers. [\#238](https://github.com/emberjs/ember-qunit/pull/238) ([rwjblue](https://github.com/rwjblue))
- Upgrade package versions [\#235](https://github.com/emberjs/ember-qunit/pull/235) ([elwayman02](https://github.com/elwayman02))
- Add callback to README.md [\#230](https://github.com/emberjs/ember-qunit/pull/230) ([rfb](https://github.com/rfb))
- \[FIXES \#227\] [\#228](https://github.com/emberjs/ember-qunit/pull/228) ([stefanpenner](https://github.com/stefanpenner))
- Update README.md [\#225](https://github.com/emberjs/ember-qunit/pull/225) ([ocrampete16](https://github.com/ocrampete16))
- Update README.md [\#224](https://github.com/emberjs/ember-qunit/pull/224) ([jrowlingson](https://github.com/jrowlingson))
- install bower components the correct directory [\#223](https://github.com/emberjs/ember-qunit/pull/223) ([CodeOfficer](https://github.com/CodeOfficer))
- Export `skip` Qunit with wrapper. [\#219](https://github.com/emberjs/ember-qunit/pull/219) ([chriskrycho](https://github.com/chriskrycho))

## [v0.4.20](https://github.com/emberjs/ember-qunit/tree/v0.4.20) (2016-02-01)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.19...v0.4.20)

**Merged pull requests:**

- Run ember-test-helpers through Babel. [\#216](https://github.com/emberjs/ember-qunit/pull/216) ([rwjblue](https://github.com/rwjblue))

## [v0.4.19](https://github.com/emberjs/ember-qunit/tree/v0.4.19) (2016-01-31)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.18...v0.4.19)

## [v0.4.18](https://github.com/emberjs/ember-qunit/tree/v0.4.18) (2015-12-12)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.17...v0.4.18)

**Merged pull requests:**

- Consume ember-test-helpers from NPM. [\#213](https://github.com/emberjs/ember-qunit/pull/213) ([rwjblue](https://github.com/rwjblue))

## [v0.4.17](https://github.com/emberjs/ember-qunit/tree/v0.4.17) (2015-12-07)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.16...v0.4.17)

**Closed issues:**

- EmberQUnit\#test does not mirror QUnit\#test [\#210](https://github.com/emberjs/ember-qunit/issues/210)

**Merged pull requests:**

- Mirror QUnit test/only function signatures [\#211](https://github.com/emberjs/ember-qunit/pull/211) ([nickiaconis](https://github.com/nickiaconis))

## [v0.4.16](https://github.com/emberjs/ember-qunit/tree/v0.4.16) (2015-11-10)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.15...v0.4.16)

**Closed issues:**

- Where does the "ember.run" belong when integration testing? [\#203](https://github.com/emberjs/ember-qunit/issues/203)

**Merged pull requests:**

- Change test wrapper callback from `call` to `apply` [\#206](https://github.com/emberjs/ember-qunit/pull/206) ([elwayman02](https://github.com/elwayman02))
- \[RFC\] Adds a wrapped QUnit.only [\#205](https://github.com/emberjs/ember-qunit/pull/205) ([ebenoist](https://github.com/ebenoist))

## [v0.4.15](https://github.com/emberjs/ember-qunit/tree/v0.4.15) (2015-10-21)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.14...v0.4.15)

**Closed issues:**

- Service injection in integration tests does not work [\#200](https://github.com/emberjs/ember-qunit/issues/200)
- Regression in models with two words from 0.4.9 to 0.4.10 [\#199](https://github.com/emberjs/ember-qunit/issues/199)

## [v0.4.14](https://github.com/emberjs/ember-qunit/tree/v0.4.14) (2015-10-20)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.13...v0.4.14)

**Closed issues:**

- QUnit.module support? [\#196](https://github.com/emberjs/ember-qunit/issues/196)
- Tests broke between 0.4.11 and 0.4.12 [\#195](https://github.com/emberjs/ember-qunit/issues/195)

**Merged pull requests:**

- Fix README backticks for component hbs render statement [\#198](https://github.com/emberjs/ember-qunit/pull/198) ([kpfefferle](https://github.com/kpfefferle))
- Update year in readme [\#197](https://github.com/emberjs/ember-qunit/pull/197) ([Kuzirashi](https://github.com/Kuzirashi))

## [v0.4.13](https://github.com/emberjs/ember-qunit/tree/v0.4.13) (2015-10-02)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.12...v0.4.13)

## [v0.4.12](https://github.com/emberjs/ember-qunit/tree/v0.4.12) (2015-10-01)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.11...v0.4.12)

**Closed issues:**

- moduleForModel leaking state between tests [\#194](https://github.com/emberjs/ember-qunit/issues/194)

**Merged pull requests:**

- Remove redundant build step [\#191](https://github.com/emberjs/ember-qunit/pull/191) ([ef4](https://github.com/ef4))
- Better exception messages on phantomjs [\#190](https://github.com/emberjs/ember-qunit/pull/190) ([ef4](https://github.com/ef4))

## [v0.4.11](https://github.com/emberjs/ember-qunit/tree/v0.4.11) (2015-09-13)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.10...v0.4.11)

**Closed issues:**

- \[QUESTION\]: what version of this library should I be using with Ember 2.0.0+ [\#188](https://github.com/emberjs/ember-qunit/issues/188)
- Ember Qunit should warn when forcing an integration test into a unit test. [\#185](https://github.com/emberjs/ember-qunit/issues/185)
- Component unit test this.render\(\) call doesn't support passing in content [\#182](https://github.com/emberjs/ember-qunit/issues/182)
- Unit Tests throw error: "Uncaught Error: Assertion Failed: BUG: Render node exists without concomitant env" [\#178](https://github.com/emberjs/ember-qunit/issues/178)

**Merged pull requests:**

- update readme [\#189](https://github.com/emberjs/ember-qunit/pull/189) ([ronaldsuwandi](https://github.com/ronaldsuwandi))
- jQuery syntax [\#187](https://github.com/emberjs/ember-qunit/pull/187) ([aceofspades](https://github.com/aceofspades))

## [v0.4.10](https://github.com/emberjs/ember-qunit/tree/v0.4.10) (2015-08-20)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.9...v0.4.10)

**Closed issues:**

- Testing bound handlebars helpers [\#5](https://github.com/emberjs/ember-qunit/issues/5)

**Merged pull requests:**

- Update README.md [\#181](https://github.com/emberjs/ember-qunit/pull/181) ([MattNguyen](https://github.com/MattNguyen))

## [v0.4.9](https://github.com/emberjs/ember-qunit/tree/v0.4.9) (2015-07-30)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.8...v0.4.9)

## [v0.4.8](https://github.com/emberjs/ember-qunit/tree/v0.4.8) (2015-07-30)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.7...v0.4.8)

**Closed issues:**

- support for assert.notOk ? [\#180](https://github.com/emberjs/ember-qunit/issues/180)

**Merged pull requests:**

- Updated README.md with newer syntax [\#179](https://github.com/emberjs/ember-qunit/pull/179) ([thec0keman](https://github.com/thec0keman))

## [v0.4.7](https://github.com/emberjs/ember-qunit/tree/v0.4.7) (2015-07-28)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.6...v0.4.7)

**Closed issues:**

- Unit tests with components and new life-cycle hooks [\#174](https://github.com/emberjs/ember-qunit/issues/174)

## [v0.4.6](https://github.com/emberjs/ember-qunit/tree/v0.4.6) (2015-07-24)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.5...v0.4.6)

## [v0.4.5](https://github.com/emberjs/ember-qunit/tree/v0.4.5) (2015-07-23)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.4...v0.4.5)

## [v0.4.4](https://github.com/emberjs/ember-qunit/tree/v0.4.4) (2015-07-21)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.3...v0.4.4)

## [v0.4.3](https://github.com/emberjs/ember-qunit/tree/v0.4.3) (2015-07-21)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.2...v0.4.3)

## [v0.4.2](https://github.com/emberjs/ember-qunit/tree/v0.4.2) (2015-07-20)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.1...v0.4.2)

**Closed issues:**

- Compatibility with 1.13+  [\#177](https://github.com/emberjs/ember-qunit/issues/177)
- Cannot send actions to Routes [\#172](https://github.com/emberjs/ember-qunit/issues/172)

## [v0.4.1](https://github.com/emberjs/ember-qunit/tree/v0.4.1) (2015-07-06)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.4.0...v0.4.1)

**Closed issues:**

- version not found: ember-cli-qunit@0.4.0 [\#176](https://github.com/emberjs/ember-qunit/issues/176)

**Merged pull requests:**

- Fix brocfile include expressions to use literal dots [\#171](https://github.com/emberjs/ember-qunit/pull/171) ([j-](https://github.com/j-))

## [v0.4.0](https://github.com/emberjs/ember-qunit/tree/v0.4.0) (2015-05-18)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.3.4...v0.4.0)

**Merged pull requests:**

- Update ember-test-helpers to 0.5.0. [\#170](https://github.com/emberjs/ember-qunit/pull/170) ([rwjblue](https://github.com/rwjblue))

## [v0.3.4](https://github.com/emberjs/ember-qunit/tree/v0.3.4) (2015-05-18)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.3.3...v0.3.4)

**Closed issues:**

- can't test custom factories [\#169](https://github.com/emberjs/ember-qunit/issues/169)

## [v0.3.3](https://github.com/emberjs/ember-qunit/tree/v0.3.3) (2015-05-15)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.3.2...v0.3.3)

**Closed issues:**

- calling resetViews causes Ember integration tests to fail [\#86](https://github.com/emberjs/ember-qunit/issues/86)

**Merged pull requests:**

- Remove dubious `resetViews` function [\#167](https://github.com/emberjs/ember-qunit/pull/167) ([ef4](https://github.com/ef4))

## [v0.3.2](https://github.com/emberjs/ember-qunit/tree/v0.3.2) (2015-05-06)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.3.1...v0.3.2)

**Closed issues:**

- Fails to pluralize `factory` in unit test [\#162](https://github.com/emberjs/ember-qunit/issues/162)

**Merged pull requests:**

- Add main entry to bower.json [\#161](https://github.com/emberjs/ember-qunit/pull/161) ([ryanmurakami](https://github.com/ryanmurakami))

## [v0.3.1](https://github.com/emberjs/ember-qunit/tree/v0.3.1) (2015-04-05)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.3.0...v0.3.1)

**Closed issues:**

- Called stop\(\) outside of a test context [\#155](https://github.com/emberjs/ember-qunit/issues/155)
- subject helper in moduleForModel reuses container for all tests [\#81](https://github.com/emberjs/ember-qunit/issues/81)

**Merged pull requests:**

- Send full stack trace information on promise rejection [\#116](https://github.com/emberjs/ember-qunit/pull/116) ([yayalice](https://github.com/yayalice))

## [v0.3.0](https://github.com/emberjs/ember-qunit/tree/v0.3.0) (2015-03-24)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.12...v0.3.0)

**Closed issues:**

- TypeError: Cannot read property 'apply' of undefined, using apply in tests? [\#149](https://github.com/emberjs/ember-qunit/issues/149)

**Merged pull requests:**

- Update ember-test-helpers to 0.4.1. [\#159](https://github.com/emberjs/ember-qunit/pull/159) ([rwjblue](https://github.com/rwjblue))

## [v0.2.12](https://github.com/emberjs/ember-qunit/tree/v0.2.12) (2015-03-22)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.11...v0.2.12)

**Closed issues:**

- assert passed into beforeEach is not refreshed [\#157](https://github.com/emberjs/ember-qunit/issues/157)
- beforeEach in moduleForComponent does not pass in assert [\#156](https://github.com/emberjs/ember-qunit/issues/156)
- this.subject calls not generating new instances [\#154](https://github.com/emberjs/ember-qunit/issues/154)

**Merged pull requests:**

- Ensure that `assert` argument in beforeEach is not shared. [\#158](https://github.com/emberjs/ember-qunit/pull/158) ([rwjblue](https://github.com/rwjblue))

## [v0.2.11](https://github.com/emberjs/ember-qunit/tree/v0.2.11) (2015-03-12)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.10...v0.2.11)

**Closed issues:**

- `assert` argument to `beforeEach` and `afterEach` [\#151](https://github.com/emberjs/ember-qunit/issues/151)
- moduleForComponent tests and loading app/initializers [\#150](https://github.com/emberjs/ember-qunit/issues/150)
- Async method selector resolves immediately [\#148](https://github.com/emberjs/ember-qunit/issues/148)
- importing { module, test } from ember-qunit hides tests  [\#147](https://github.com/emberjs/ember-qunit/issues/147)
- import QUnit from "???"; [\#146](https://github.com/emberjs/ember-qunit/issues/146)
- Thanks! [\#145](https://github.com/emberjs/ember-qunit/issues/145)
- doesn't work with new container registry stuff [\#118](https://github.com/emberjs/ember-qunit/issues/118)
- moduleFor\* integration: true [\#108](https://github.com/emberjs/ember-qunit/issues/108)
- Tricky to use moduleForComponent for components with sub-components [\#74](https://github.com/emberjs/ember-qunit/issues/74)

**Merged pull requests:**

- Update ember-test-helpers to 0.3.6. [\#153](https://github.com/emberjs/ember-qunit/pull/153) ([rwjblue](https://github.com/rwjblue))
- Ensure that `beforeEach` / `afterEach` get `assert` argument. [\#152](https://github.com/emberjs/ember-qunit/pull/152) ([rwjblue](https://github.com/rwjblue))

## [v0.2.10](https://github.com/emberjs/ember-qunit/tree/v0.2.10) (2015-02-22)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.9...v0.2.10)

**Closed issues:**

- Add skip as a qunit helper that gets exported? [\#144](https://github.com/emberjs/ember-qunit/issues/144)

## [v0.2.9](https://github.com/emberjs/ember-qunit/tree/v0.2.9) (2015-02-19)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.8...v0.2.9)

**Closed issues:**

- 'assert' is undefined [\#142](https://github.com/emberjs/ember-qunit/issues/142)
- Exporting `QUnit.push` [\#140](https://github.com/emberjs/ember-qunit/issues/140)
- moduleForComponent fails "Unable to find partial with name" [\#110](https://github.com/emberjs/ember-qunit/issues/110)

**Merged pull requests:**

- Add skip to shim. [\#141](https://github.com/emberjs/ember-qunit/pull/141) ([abuiles](https://github.com/abuiles))
- Update examples for QUnit 2.x [\#138](https://github.com/emberjs/ember-qunit/pull/138) ([jbrown](https://github.com/jbrown))

## [v0.2.8](https://github.com/emberjs/ember-qunit/tree/v0.2.8) (2015-02-10)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.7...v0.2.8)

## [v0.2.7](https://github.com/emberjs/ember-qunit/tree/v0.2.7) (2015-02-10)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.6...v0.2.7)

**Closed issues:**

- Still expects handlebars to be in bower\_components [\#133](https://github.com/emberjs/ember-qunit/issues/133)
- Error: Path or pattern "bower\_components/ember-qunit/named-amd/main.js" did not match any files [\#131](https://github.com/emberjs/ember-qunit/issues/131)
- Could not find module ember when using the global version \(newest from build\) [\#130](https://github.com/emberjs/ember-qunit/issues/130)

**Merged pull requests:**

- Ensure that "ember" module shim is available for globals build. [\#137](https://github.com/emberjs/ember-qunit/pull/137) ([rwjblue](https://github.com/rwjblue))

## [v0.2.6](https://github.com/emberjs/ember-qunit/tree/v0.2.6) (2015-02-10)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.5...v0.2.6)

**Closed issues:**

- Direct child doesn't work in selector [\#135](https://github.com/emberjs/ember-qunit/issues/135)

**Merged pull requests:**

- Add default export for qunit module as QUnit. [\#136](https://github.com/emberjs/ember-qunit/pull/136) ([rwjblue](https://github.com/rwjblue))
- Upgrade ember to 1.10.0 and remove handlebars. [\#134](https://github.com/emberjs/ember-qunit/pull/134) ([dgeb](https://github.com/dgeb))

## [v0.2.5](https://github.com/emberjs/ember-qunit/tree/v0.2.5) (2015-02-07)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.4...v0.2.5)

**Closed issues:**

- Emq not available - no globalize [\#129](https://github.com/emberjs/ember-qunit/issues/129)

**Merged pull requests:**

- Add qunit ES6 shim. [\#132](https://github.com/emberjs/ember-qunit/pull/132) ([rwjblue](https://github.com/rwjblue))

## [v0.2.4](https://github.com/emberjs/ember-qunit/tree/v0.2.4) (2015-02-03)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.3...v0.2.4)

**Merged pull requests:**

- Fix argument shifting with `beforeEach` / `afterEach`. [\#128](https://github.com/emberjs/ember-qunit/pull/128) ([rwjblue](https://github.com/rwjblue))

## [v0.2.3](https://github.com/emberjs/ember-qunit/tree/v0.2.3) (2015-02-03)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.2...v0.2.3)

**Merged pull requests:**

- Use git-repo-version instead of git-repo-info directly. [\#127](https://github.com/emberjs/ember-qunit/pull/127) ([rwjblue](https://github.com/rwjblue))
- Pass test callback argument through from QUnit. [\#126](https://github.com/emberjs/ember-qunit/pull/126) ([rwjblue](https://github.com/rwjblue))

## [v0.2.2](https://github.com/emberjs/ember-qunit/tree/v0.2.2) (2015-02-03)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.1...v0.2.2)

**Merged pull requests:**

- Allow usage of beforeEach and afterEach. [\#125](https://github.com/emberjs/ember-qunit/pull/125) ([rwjblue](https://github.com/rwjblue))

## [v0.2.1](https://github.com/emberjs/ember-qunit/tree/v0.2.1) (2015-02-02)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.2.0...v0.2.1)

**Closed issues:**

- container used in unit tests doesn't normalize model names [\#119](https://github.com/emberjs/ember-qunit/issues/119)

**Merged pull requests:**

- Ensure build output is ES3 safe. [\#124](https://github.com/emberjs/ember-qunit/pull/124) ([rwjblue](https://github.com/rwjblue))

## [v0.2.0](https://github.com/emberjs/ember-qunit/tree/v0.2.0) (2015-01-31)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/latest...v0.2.0)

## [latest](https://github.com/emberjs/ember-qunit/tree/latest) (2015-01-31)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.8...latest)

**Closed issues:**

- Testing services in Ember-CLI conserves state between tests. [\#115](https://github.com/emberjs/ember-qunit/issues/115)
- why kill `dist/`? [\#101](https://github.com/emberjs/ember-qunit/issues/101)
- Wrong context in asyncTest \(using callbacks given to moduleFor instead of extended callbacks\) [\#98](https://github.com/emberjs/ember-qunit/issues/98)
- Qunit not finishing on Mac OS X [\#97](https://github.com/emberjs/ember-qunit/issues/97)
- Cannot send action to route in unit test. [\#96](https://github.com/emberjs/ember-qunit/issues/96)
- Unit testing model circular relationship requires `startApp\(\)` [\#91](https://github.com/emberjs/ember-qunit/issues/91)
- Integration Test Helpers are undefined in Component Test [\#88](https://github.com/emberjs/ember-qunit/issues/88)
- IsolatedContainer doesn't normalize type names [\#84](https://github.com/emberjs/ember-qunit/issues/84)
- Should have a mechanism for inserting components sans `this.$\(\)` [\#82](https://github.com/emberjs/ember-qunit/issues/82)
- Assertion alternately thrown when testing ED Model relationships [\#80](https://github.com/emberjs/ember-qunit/issues/80)
- Uncaught SyntaxError: Unexpected reserved word [\#78](https://github.com/emberjs/ember-qunit/issues/78)
- QUnit start and stop not happening for promises within controller actions. [\#77](https://github.com/emberjs/ember-qunit/issues/77)
- Testing components with {{each}} helper in layout fails [\#73](https://github.com/emberjs/ember-qunit/issues/73)
- Get access to ember store from moduleFor\("controller:activity"\) [\#70](https://github.com/emberjs/ember-qunit/issues/70)
- `moduleForComponent` does not properly destroy the views it created [\#64](https://github.com/emberjs/ember-qunit/issues/64)
- Testing Strangeness using Ember Qunit and Test Helpers [\#63](https://github.com/emberjs/ember-qunit/issues/63)
- moduleForModel transforms [\#61](https://github.com/emberjs/ember-qunit/issues/61)
- Bower dependency to qunit? [\#60](https://github.com/emberjs/ember-qunit/issues/60)
- Result of `this.$\(...\)` is cached after first call [\#55](https://github.com/emberjs/ember-qunit/issues/55)
- testing components that use other components [\#53](https://github.com/emberjs/ember-qunit/issues/53)
- moduleForComponent and moduleForModel could also accept a delegate function [\#51](https://github.com/emberjs/ember-qunit/issues/51)
- andThen does not execute after click\(\) [\#49](https://github.com/emberjs/ember-qunit/issues/49)
- Tests fail with `MODEL\_FACTORY\_INJECTIONS = true` [\#48](https://github.com/emberjs/ember-qunit/issues/48)
- Contributing steps do not work [\#47](https://github.com/emberjs/ember-qunit/issues/47)
- moduleFor could accept `callback` as second argument [\#45](https://github.com/emberjs/ember-qunit/issues/45)
- dist/named-amd does not work [\#42](https://github.com/emberjs/ember-qunit/issues/42)
- setting  Ember.testing to true [\#38](https://github.com/emberjs/ember-qunit/issues/38)
- separate the ember stuff from the qunit stuff [\#22](https://github.com/emberjs/ember-qunit/issues/22)
- moduleForMixin? [\#15](https://github.com/emberjs/ember-qunit/issues/15)

**Merged pull requests:**

- Add ember-cli for ease of use. [\#122](https://github.com/emberjs/ember-qunit/pull/122) ([rwjblue](https://github.com/rwjblue))
- Bumping ember-test-helpers and upgraded module transpiler [\#120](https://github.com/emberjs/ember-qunit/pull/120) ([chadhietala](https://github.com/chadhietala))
- upgrade ember-test-helpers to 0.0.7 [\#111](https://github.com/emberjs/ember-qunit/pull/111) ([jonbretman](https://github.com/jonbretman))
- Setup build publishing. [\#106](https://github.com/emberjs/ember-qunit/pull/106) ([rwjblue](https://github.com/rwjblue))
- Move to broccoli-funnel. [\#105](https://github.com/emberjs/ember-qunit/pull/105) ([rwjblue](https://github.com/rwjblue))
- Generate `bower.json` in build. [\#104](https://github.com/emberjs/ember-qunit/pull/104) ([rwjblue](https://github.com/rwjblue))
- Add globals build and bower build script [\#103](https://github.com/emberjs/ember-qunit/pull/103) ([dgeb](https://github.com/dgeb))
- Build process updates. [\#102](https://github.com/emberjs/ember-qunit/pull/102) ([rwjblue](https://github.com/rwjblue))
- Add a few more npm scripts. [\#100](https://github.com/emberjs/ember-qunit/pull/100) ([rwjblue](https://github.com/rwjblue))
- Refactor to use the extracted lib ember-test-helpers [\#99](https://github.com/emberjs/ember-qunit/pull/99) ([dgeb](https://github.com/dgeb))
- Root element auto-add ordering [\#93](https://github.com/emberjs/ember-qunit/pull/93) ([slindberg](https://github.com/slindberg))
- Update ember-data to beta.10 [\#90](https://github.com/emberjs/ember-qunit/pull/90) ([saygun](https://github.com/saygun))
- `isolated-container` should  call `resolver.normalize\(fullName\)` when resolving needs values. [\#89](https://github.com/emberjs/ember-qunit/pull/89) ([workmanw](https://github.com/workmanw))
- \[BUGFIX\] Destroy components on teardown. [\#85](https://github.com/emberjs/ember-qunit/pull/85) ([gordonkristan](https://github.com/gordonkristan))
- Update README with simple usage and updated travis repository [\#79](https://github.com/emberjs/ember-qunit/pull/79) ([Frozenfire92](https://github.com/Frozenfire92))
- Testing nested components with templates. [\#72](https://github.com/emberjs/ember-qunit/pull/72) ([tsched](https://github.com/tsched))
- fix npm install errors for karma-qunit and qunit [\#67](https://github.com/emberjs/ember-qunit/pull/67) ([fivetanley](https://github.com/fivetanley))
- Update readme with info on building dist/ [\#66](https://github.com/emberjs/ember-qunit/pull/66) ([bantic](https://github.com/bantic))
- Do not require Ember Data. [\#62](https://github.com/emberjs/ember-qunit/pull/62) ([rwjblue](https://github.com/rwjblue))
- Fix error in code example [\#57](https://github.com/emberjs/ember-qunit/pull/57) ([balinterdi](https://github.com/balinterdi))
- Fixed `this.$\(selector\)` returning cached result [\#56](https://github.com/emberjs/ember-qunit/pull/56) ([chancancode](https://github.com/chancancode))
- Pass the selector to this.$\(...\) helper in component tests [\#54](https://github.com/emberjs/ember-qunit/pull/54) ([chancancode](https://github.com/chancancode))
- Updating readme with information about async tests [\#50](https://github.com/emberjs/ember-qunit/pull/50) ([Emerson](https://github.com/Emerson))

## [v0.1.8](https://github.com/emberjs/ember-qunit/tree/v0.1.8) (2014-04-24)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.7...v0.1.8)

**Closed issues:**

- Unit testing models with associations/relationships fail [\#39](https://github.com/emberjs/ember-qunit/issues/39)
- loading with require.js [\#35](https://github.com/emberjs/ember-qunit/issues/35)

**Merged pull requests:**

- to run broccoli serve you need broccoli-cli [\#41](https://github.com/emberjs/ember-qunit/pull/41) ([zigomir](https://github.com/zigomir))
- Add adapter to module for model [\#34](https://github.com/emberjs/ember-qunit/pull/34) ([mixonic](https://github.com/mixonic))

## [v0.1.7](https://github.com/emberjs/ember-qunit/tree/v0.1.7) (2014-04-04)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.6...v0.1.7)

**Closed issues:**

- How to tell QUnit to execute tests wrapped in AMD definition ? [\#31](https://github.com/emberjs/ember-qunit/issues/31)
- What's the bare minimum required to test a ember.object in isolation? [\#30](https://github.com/emberjs/ember-qunit/issues/30)
- Calling save on models [\#28](https://github.com/emberjs/ember-qunit/issues/28)

**Merged pull requests:**

- assume qunit is a global on page [\#32](https://github.com/emberjs/ember-qunit/pull/32) ([knomedia](https://github.com/knomedia))
- \[dist\] newest build [\#27](https://github.com/emberjs/ember-qunit/pull/27) ([danjamin](https://github.com/danjamin))
- moves the setup into \_callbacks.setup [\#26](https://github.com/emberjs/ember-qunit/pull/26) ([fsmanuel](https://github.com/fsmanuel))
- Remove unnecessary \#ember-testing append in moduleFor. [\#19](https://github.com/emberjs/ember-qunit/pull/19) ([omghax](https://github.com/omghax))

## [v0.1.6](https://github.com/emberjs/ember-qunit/tree/v0.1.6) (2014-03-27)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.5...v0.1.6)

**Closed issues:**

- README? [\#13](https://github.com/emberjs/ember-qunit/issues/13)

**Merged pull requests:**

- Remove explicit paths to node\_modules/.bin. [\#18](https://github.com/emberjs/ember-qunit/pull/18) ([eventualbuddha](https://github.com/eventualbuddha))
- fixed global resolver setup instructions [\#17](https://github.com/emberjs/ember-qunit/pull/17) ([cavneb](https://github.com/cavneb))
- moduleFor controller with needs fails on second call with undefined [\#16](https://github.com/emberjs/ember-qunit/pull/16) ([fsmanuel](https://github.com/fsmanuel))

## [v0.1.5](https://github.com/emberjs/ember-qunit/tree/v0.1.5) (2014-03-12)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.4...v0.1.5)

## [v0.1.4](https://github.com/emberjs/ember-qunit/tree/v0.1.4) (2014-03-12)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.3...v0.1.4)

**Merged pull requests:**

- Added moduleForModel helper with test [\#9](https://github.com/emberjs/ember-qunit/pull/9) ([cavneb](https://github.com/cavneb))
- Add  import for moduleFor. [\#8](https://github.com/emberjs/ember-qunit/pull/8) ([abuiles](https://github.com/abuiles))

## [v0.1.3](https://github.com/emberjs/ember-qunit/tree/v0.1.3) (2014-03-04)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.2...v0.1.3)

## [v0.1.2](https://github.com/emberjs/ember-qunit/tree/v0.1.2) (2014-03-04)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.1...v0.1.2)

## [v0.1.1](https://github.com/emberjs/ember-qunit/tree/v0.1.1) (2014-03-03)
[Full Changelog](https://github.com/emberjs/ember-qunit/compare/v0.1.0...v0.1.1)

**Closed issues:**

- Needs a README [\#4](https://github.com/emberjs/ember-qunit/issues/4)

**Merged pull requests:**

- add event dispatcher [\#7](https://github.com/emberjs/ember-qunit/pull/7) ([ryanflorence](https://github.com/ryanflorence))

## [v0.1.0](https://github.com/emberjs/ember-qunit/tree/v0.1.0) (2014-02-27)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*