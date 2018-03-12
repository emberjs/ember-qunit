# ember-qunit [![Build Status](https://travis-ci.org/emberjs/ember-qunit.svg)](https://travis-ci.org/emberjs/ember-qunit)

[![Latest NPM release][npm-badge]][npm-badge-url]
[![TravisCI Build Status][travis-badge]][travis-badge-url]

[npm-badge]: https://img.shields.io/npm/v/ember-qunit.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-qunit
[travis-badge]: https://img.shields.io/travis/emberjs/ember-qunit/master.svg
[travis-badge-url]: https://travis-ci.org/emberjs/ember-qunit

ember-qunit simplifies testing of Ember applications with
[QUnit](https://qunitjs.com/) by providing QUnit-specific wrappers around the
helpers contained in
[ember-test-helpers](https://github.com/emberjs/ember-test-helpers).


Installation
------------------------------------------------------------------------------

`ember-qunit` is an [Ember CLI](http://www.ember-cli.com/) addon, so install it
as you would any other addon:

```sh
$ ember install ember-qunit
```

Some other addons are detecting the test framework based on the installed
addon names and are expecting `ember-cli-qunit` instead. If you have issues
with this then `ember install ember-cli-qunit`, which should work exactly
the same.


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-qunit`
* `npm install`

### Running tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
