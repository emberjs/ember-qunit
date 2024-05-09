# ember-qunit

[![Latest NPM release][npm-badge]][npm-badge-url]
[![CI Build Status][ci-badge]][ci-badge-url]

[npm-badge]: https://img.shields.io/npm/v/ember-qunit.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-qunit
[ci-badge]: https://github.com/emberjs/ember-qunit/workflows/CI/badge.svg
[ci-badge-url]: https://github.com/emberjs/ember-qunit/actions?query=workflow%3ACI

ember-qunit simplifies testing of Ember applications with
[QUnit](https://qunitjs.com/) by providing QUnit-specific wrappers around the
helpers contained in
[ember-test-helpers](https://github.com/emberjs/ember-test-helpers).


Requirements
------------------------------------------------------------------------------

* Ember.js v4.0 or above
* [Ember Auto Import](https://github.com/embroider-build/ember-auto-import) v2 or above (or Embroider) 
* Node.js v16 or above
- TypeScript 4.8 and 4.9
  - SemVer policy: [simple majors](https://www.semver-ts.org/#simple-majors)
  - The public API is defined by the [Usage](#usage) section below.
* ember-cli ~v4.8.1, ~v4.12.2, >= v5.1

If you need support for Node 14 please use v6.2 of this addon.

If you need support for Node 13 or older Ember CLI versions please use v4.x
of this addon.


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

Upgrading
------------------------------------------------------------------------------

For instructions how to upgrade to the latest version, please read our
[Migration Guide](docs/migration.md).

Usage
------------------------------------------------------------------------------

The following section describes the use of ember-qunit with the latest modern
Ember testing APIs, as laid out in the RFCs
[232](https://github.com/emberjs/rfcs/blob/master/text/0232-simplify-qunit-testing-api.md)
and
[268](https://github.com/emberjs/rfcs/blob/master/text/0268-acceptance-testing-refactor.md).

For the older APIs have a look at our [Legacy Guide](docs/legacy.md).

### Setting the Application

Your `tests/test-helper.js` file should look similar to the following, to
correctly setup the application required by `@ember/test-helpers`:

```javascript
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
```

Also make sure that you have set `ENV.APP.autoboot = false;` for the `test`
environment in your `config/environment.js`.

### Setup Tests

The `setupTest()` function can be used to setup a unit test for any kind
of "module/unit" of your application that can be looked up in a container.

It will setup your test context with:

* `this.owner` to interact with Ember's [Dependency Injection](https://guides.emberjs.com/v3.0.0/applications/dependency-injection/)
  system
* `this.set()`, `this.setProperties()`, `this.get()`, and `this.getProperties()`
* `this.pauseTest()` method to allow easy pausing/resuming of tests

For example, the following is a unit test for the `SidebarController`:

```javascript
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('SidebarController', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('exists', function() {
    let controller = this.owner.lookup('controller:sidebar');
    assert.ok(controller);
  });
});
```


### Setup Rendering Tests

The `setupRenderingTest()` function is specifically designed for tests that
render arbitrary templates, including components and helpers.

It will setup your test context the same way as `setupTest()`, and additionally:

* Initializes Ember's renderer to be used with the
  [Rendering helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#rendering-helpers),
  specifically `render()`
* sets up the [DOM Interaction Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#dom-interaction-helpers)
  from `@ember/test-helpers` (`click()`, `fillIn()`, ...)

```javascript
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('GravatarImageComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function() {
    await render(hbs`{{gravatar-image}}`);
    assert.ok(find('img'));
  });
});
```

### Setup Application Tests

The `setupApplicationTest()` function can be used to run tests that interact
with the whole application, so in most cases acceptance tests.

On top of `setupTest()` it will:

* Boot your application instance
* Set up all the [DOM Interaction Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#dom-interaction-helpers)
  (`click()`, `fillIn()`, ...) as well as the [Routing Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#routing-helpers)
  (`visit()`, `currentURL()`, ...) from `@ember/test-helpers`

```javascript
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';

module('basic acceptance test', function(hooks) {
  setupApplicationTest(hooks);

  test('can visit /', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
  });
});
```

## Configuration 

Configuration is optionally managed via [`@embroider/macros`](https://www.npmjs.com/package/@embroider/macros)

To configure `ember-qunit`, in your `ember-cli-build.js`, add:
```js 
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    '@embroider/macros': {
      setConfig: {
        'ember-qunit': {
          /**
           * default: false
           *
           * removes the CSS for the test-container (where the app and components are rendered to)
           */
          disableContainerStyles: true,
          /**
           * default: 'qunit-default'
           * options: 'qunit-default' | 'ember'
           * 
           * Sets the theme for the Web UI of the test runner. Use a different value to disable loading any theme, allowing you to provide your own external one.
           */
          theme: 'qunit-default',
        },
      },
    },
    /* ... */ 
  });

  /* ... */
};
```


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-qunit`
* `pnpm install`

### Running tests

* `pnpm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
