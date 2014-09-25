Ember QUnit
===========

[![Build Status](https://travis-ci.org/rjackson/ember-qunit.png)](https://travis-ci.org/rwjblue/ember-qunit)

[WIP] Unit test helpers for Ember.

About
-----

Ember QUnit uses your application's resolver to find and automatically
create test subjects for you with the `moduleFor` and `test` helpers.

*This is a work in progress* but its also quite handy already. Feedback
is highly encouraged.

Simple Usage
------------

Include `dist/globals/main.js` as a script in your tests index.html

Module Formats
--------------

You will find all the popular formats in `dist/`. If using globals, all
methods are found on `window.emq`.

Examples
--------

### Global build setup:

```js
// inject test helpers onto window
emq.globalize();
```

### Setting the resolver

```js
// if you don't have a custom resolver, do it like this:
setResolver(Ember.DefaultResolver.create({namespace: App}));

// otherwise something like:
import Resolver from './path/to/resolver';
import {setResolver} from 'ember-qunit';
setResolver(Resolver.create());
```

### Simple example:

```js
// tell ember qunit what you are testing, it will find it from the
// resolver
moduleForComponent('x-foo', 'XFooComponent');

// run a test
test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component.state, 'preRender');

  // render the component on the page
  this.render();
  equal(component.state, 'inDOM');
});
```

### Complex example

```js
// a more complex example taken from ic-tabs
moduleForComponent('ic-tabs', 'TabsComponent', {

  // specify the other units that are required for this test
  needs: [
    'component:ic-tab',
    'component:ic-tab-panel',
    'component:ic-tab-list'
  ]
});

test('selects first tab and shows the panel', function() {
  expect(3);
  var component = this.subject({

    // can provide properties for the subject, like the yielded template
    // of a component (not the layout, in this case)
    template: Ember.Handlebars.compile(''+
      '{{#ic-tab-list}}'+
        '{{#ic-tab id="tab1"}}tab1{{/ic-tab}}'+
        '{{#ic-tab id="tab2"}}tab2{{/ic-tab}}'+
        '{{#ic-tab id="tab3"}}tab3{{/ic-tab}}'+
      '{{/ic-tab-list}}'+
      '{{#ic-tab-panel id="panel1"}}one{{/ic-tab-panel}}'+
      '{{#ic-tab-panel id="panel2"}}two{{/ic-tab-panel}}'+
      '{{#ic-tab-panel id="panel3"}}three{{/ic-tab-panel}}'
    })
  });
  this.render();
  var tab1 = Ember.View.views['tab1'];
  var panel1 = Ember.View.views['panel1'];
  ok(component.get('activeTab') === tab1);
  ok(tab1.get('active'));
  var el = tab1.$();
  ok(panel1.$().is(':visible'));
});
```
If you are using nested components with templates, you have to list them separately - otherwise your templates won't be loaded:
```js
moduleForComponent('ic-tabs', 'TabsComponent', {

  // specify the other units and templates that are required for this test
  needs: [
    'component:ic-tab',
    'template:components/ic-tab',
    'component:ic-tab-panel',
    'template:components/ic-tab-panel',
    'component:ic-tab-list'
  ]
});
.....
```

### Async Example

Under the hood, if you use `Ember.RSVP.Promise`, ember-qunit will call
QUnit's `start` and `stop` helpers to stop the test from tearing down
and running other tests while your asynchronous code runs. ember-qunit
also asserts that the promise gets fulfilled.

In addition, you can also return promises in the test body:

```js
// If you return a promise from a test callback it becomes an asyncTest. This
// is a key difference between ember-qunit and standard QUnit.
test('async is awesome', function() {
  expect(1);
  var myThing = MyThing.create();
  // myThing.exampleMethod() returns a promise
  return myThing.exampleMethod().then(function() {
    ok(myThing.get('finished'));
  });
});
```

If an error is thrown in your promise or a promise
within `test` becomes rejected, ember-qunit will fail the test.
To assert that a promise should be rejected, you can "catch"
the error and assert that you got there:

```js
test('sometimes async gets rejected', function(){
  expect(1);
  var myThing = MyThing.create()

  return myThing.exampleMethod().then(function(){
    ok(false, "promise should not be fulfilled");
  })['catch'](function(err){
    equal(err.message, "User not Authorized");
  });
});
```

Helpers
-------

### `moduleFor(fullName [, description [, callbacks]])`

- `fullName`: (String) - The full name of the unit, ie
  `controller:application`, `route:index`.

- `description`: (String) optional - The description of the module

- `callbacks`: (Object) optional - Normal QUnit callbacks (setup and
  teardown), with addition to `needs`, which allows you specify the
  other units the tests will need.

### `moduleForComponent(name, [description, callbacks])`

- `name`: (String) - the short name of the component that you'd use in a
  template, ie `x-foo`, `ic-tabs`, etc.

### `moduleForModel(name, [description, callbacks])`

- `name`: (String) - the short name of the model you'd use in `store`
  operations ie `user`, `assignmentGroup`, etc.

Contributing
------------

```sh
$ npm install
$ bower install
$ npm install -g karma-cli broccoli-cli
$ broccoli serve
# new tab
$ karma start
```

Building dist/
--------------

```sh
$ broccoli build dist
# Broccoli will not overwrite dist/, so you
# may need to delete it first
```
