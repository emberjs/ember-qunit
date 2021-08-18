
Migration Guide
==============================================================================

Upgrading from v4.x to v5.0.0
------------------------------------------------------------------------------

`ember-qunit` had a few major changes that affects apps when migrating from v4.x to v5:

* Require the application to have a `qunit` and `@ember/test-helpers` dependency of some sort
* Require the QUnit and `@ember/test-helpers` DOM fixtures to be added to the applications `tests/index.html`
* Require the application to have `ember-auto-import`
* Dropped support for usage of `ember-test-helpers` imports
* Dropped support for `moduleFor*` APIs
* Drop support for older Node versions (8, 9, 11, 13)
* Remove re-exports of QUnit functions from `ember-qunit`
* Drop support for usage with Ember older than 3.8

### `qunit` and `@ember/test-helpers` dependencies

Older versions of `ember-qunit` directly depended on `qunit` and
`@ember/test-helpers`. In v5, this relationship was changed and now
`ember-qunit` has `qunit` and `@ember/test-helpers` (v2) as peer dependencies.

In order to accomodate this change, in your application, you can run:

```sh
# npm users
npm install --save-dev qunit "@ember/test-helpers"

# yarn users
yarn add --dev qunit "@ember/test-helpers"
```

### DOM fixtures

In v5 `ember-qunit` moved from automatically providing the testing DOM fixtures to requiring that
the host application provide them itself.

In order to accomodate this change in your application add the following
snippet to your `tests/index.html` just after your `{{content-for
"test-body"}}` entry:

```html
<div id="qunit"></div>
<div id="qunit-fixture">
  <div id="ember-testing-container">
    <div id="ember-testing"></div>
  </div>
</div>
```

### QUnit DOM

If you use QUnit DOM, you may encounter the error message `assert.dom is not a function` when you run tests.

To address this issue, import and run QUnit DOM's `setup` function in your `test-helper.js` file:

```javascript
// tests/test-helper.js
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

//...

setup(QUnit.assert);

setApplication(Application.create(config.APP));

start();

//...
```

**Note**: Only make this change when you've updated your version of `ember-qunit` to a `5.x.x` version.  Doing so pre-emptively will result in errors trying to import `setup`.

### Remove `ember-test-helpers` modules

For a long time `@ember/test-helpers` re-exported all of its modules under the `ember-test-helpers` namespace,
in v5 of `ember-qunit` (which requires `@ember/test-helpers@2.0.0`) those re-exports are removed.

For the most part, you can migrate any `ember-test-helpers` imports to `@ember/test-helpers`.

### Migrating from `moduleFor*` APIs

This section provides instruction for upgrading your test suite from the
[Legacy APIs](legacy.md) to Ember's latest testing APIs based on RFCs
[232](https://github.com/emberjs/rfcs/blob/master/text/0232-simplify-qunit-testing-api.md)
and
[268](https://github.com/emberjs/rfcs/blob/master/text/0268-acceptance-testing-refactor.md).

For the complete introduction to the new testing APIs, please read the
latest [Ember Guides](https://guides.emberjs.com/release/testing/). The
following examples will give you an overview how to migrate your existing Ember
QUnit based test suite.

#### Unit tests

Before:

```javascript
import { test, moduleFor } from 'ember-qunit';

moduleFor('controller:sidebar', 'SidebarController', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
```

After:

```javascript
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('SidebarController', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('exists', function(assert) {
    let controller = this.owner.lookup('controller:sidebar');
    assert.ok(controller);
  });
});
```

##### Migration steps

* Use `module` and `test` imported from `qunit` directly
* Use `setupTest()` instead of `moduleFor()`
* Use the Owner object given by `this.owner` directly instead of `this.subject()`

You can use the
[ember-qunit-codemod](https://github.com/rwjblue/ember-qunit-codemod)
to update your test code automatically.

#### Component tests

Before:

```javascript
import { test, moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('GravatarImageComponent', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{gravatar-image}}`);
  assert.equal(this.$('img').length, 1);
});
```

After:

```javascript
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('GravatarImageComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function(assert) {
    await render(hbs`{{gravatar-image}}`);
    assert.ok(this.element.querySelector('img'));
  });
});
```

##### Migration steps

* Use `module` and `test` imported from `qunit` directly
* Use `setupRenderingTest()` instead of `moduleForComponent()`
* Render using the `render()` helper from `@ember/test-helpers` instead of
  `this.render()`
* `render()` is now always an async call, so use `async`/`await` to wait for it
  to complete
* Use `this.element` to get access to the rendered DOM
* Do not use jQuery for DOM interaction, instead use the
  [DOM Interaction Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#dom-interaction-helpers)
  from `@ember/test-helpers`

You can use the
[ember-qunit-codemod](https://github.com/rwjblue/ember-qunit-codemod)
to update your test setup code automatically.

For migrating to the DOM interaction helpers, you can use the
[ember-test-helpers-codemod](https://github.com/simonihmig/ember-test-helpers-codemod)
to automatically convert all or most of it.

#### Acceptance tests

Before:

```javascript

import { test } from 'qunit';
import moduleForAcceptance from 'app/tests/helpers/module-for-acceptance';

moduleForAcceptance('basic acceptance test');

test('can visit /', function() {
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/');
  });
});
```

After:


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

##### Migration steps

* Use `module` and `test` imported from `qunit` directly
* Use `setupApplicationTest()` instead of `moduleForAcceptance()` or `beforeEach`/`afterEach` hooks for setting up the
  application
* Use the [Routing Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#routing-helpers)
  from `@ember/test-helpers` instead of the global helpers, e.g. `visit`
* Do not use the "global" test helpers for DOM interaction, instead use the
  [DOM Interaction Helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#dom-interaction-helpers)
  from `@ember/test-helpers`
* use `async`/`await` to wait for asynchronous operations like `visit()` or
  `click()`
* use `this.element` to get access to the rendered DOM

You can use the
[ember-qunit-codemod](https://github.com/rwjblue/ember-qunit-codemod)
to update your test setup code automatically.

For migrating from the global test helpers to those proved by
`@ember/test-helpers`, you can use the
[ember-test-helpers-codemod](https://github.com/simonihmig/ember-test-helpers-codemod)
to assist you with that task.

###### Caveats

* As of ember-cli-qunit@4.1.0 / ember-qunit@3.0.0, `Ember.testing` is only set tor `true` during the test run. Previously it was always set to `true`. For more information see https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-ember-testing-in-module-scope.md
