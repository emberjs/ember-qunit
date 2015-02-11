# Ember QUnit [![Build Status](https://travis-ci.org/rwjblue/ember-qunit.png)](https://travis-ci.org/rwjblue/ember-qunit)

**IMPORTANT NOTE** - The build process is currently changing for this project. In v0.1.8 and below, builds were pushed to a `dist/` dir. Going forward, we're going to push builds to a separate repo: [ember-qunit-builds](https://github.com/rwjblue/ember-qunit-builds). Until this transition is complete, please update your bower.json if it's referencing `rwjblue/ember-qunit#master`. Instead specify a version (`rwjblue/ember-qunit#v0.1.8`) or SHA (f3f852789bc80486afae1a9ddb7810356050fe9b or older).

-------

Ember QUnit simplifies unit testing of Ember applications with QUnit by
providing QUnit-specific wrappers around the helpers contained in
[ember-test-helpers](https://github.com/switchfly/ember-test-helpers).

## Usage

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
test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component.state, 'preRender');

  // render the component on the page
  this.render();
  assert.equal(component.state, 'inDOM');
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

test('selects first tab and shows the panel', function(assert) {
  assert.expect(3);
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
  assert.ok(component.get('activeTab') === tab1);
  assert.ok(tab1.get('active'));
  var el = tab1.$();
  assert.ok(panel1.$().is(':visible'));
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
test('async is awesome', function(assert) {
  assert.expect(1);
  var myThing = MyThing.create();
  // myThing.exampleMethod() returns a promise
  return myThing.exampleMethod().then(function() {
    assert.ok(myThing.get('finished'));
  });
});
```

If an error is thrown in your promise or a promise
within `test` becomes rejected, ember-qunit will fail the test.
To assert that a promise should be rejected, you can "catch"
the error and assert that you got there:

```js
test('sometimes async gets rejected', function(assert){
  assert.expect(1);
  var myThing = MyThing.create()

  return myThing.exampleMethod().then(function(){
    assert.ok(false, "promise should not be fulfilled");
  })['catch'](function(err){
    assert.equal(err.message, "User not Authorized");
  });
});
```

## Test Helpers

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

## Contributing

Contributions are welcome. Please follow the instructions below to install and
test this library.

### Installation

```sh
$ npm install
```

### Testing

In order to test in the browser:

```sh
$ npm start
```

... and then visit [http://localhost:4200/tests](http://localhost:4200/tests).

In order to perform a CI test:

```sh
$ npm test
```

## Copyright and License

Copyright 2014 Ryan Florence and contributors. [MIT License](./LICENSE).
