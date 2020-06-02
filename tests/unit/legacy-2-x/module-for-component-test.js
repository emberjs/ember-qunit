import Ember from 'ember';
import $ from 'jquery';
import { moduleForComponent, test } from 'ember-qunit';
import { setResolverRegistry } from '../../helpers/resolver';
import hbs from 'htmlbars-inline-precompile';

var PrettyColor = Ember.Component.extend({
  classNames: ['pretty-color'],
  attributeBindings: ['style'],
  style: Ember.computed('name', function () {
    return 'color: ' + this.get('name') + ';';
  }),
});

function setupRegistry() {
  setResolverRegistry({
    'component:x-foo': Ember.Component.extend(),
    'component:pretty-color': PrettyColor,
    'template:components/pretty-color': hbs`Pretty Color: <span class="color-name">{{name}}</span>`,
  });
}

///////////////////////////////////////////////////////////////////////////////

moduleForComponent('x-foo', {
  beforeSetup: function () {
    setupRegistry();
  },
});

test('renders', function (assert) {
  assert.expect(2);
  var component = this.subject();
  assert.equal(component._state, 'preRender');
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('append', function (assert) {
  assert.expect(2);
  var component = this.subject();
  assert.equal(component._state, 'preRender');
  this.append();
  assert.equal(component._state, 'inDOM');
  // TODO - is there still a way to check deprecationWarnings?
  //  assert.ok(Ember.A(Ember.deprecationWarnings).contains('this.append() is deprecated. Please use this.render() instead.'));
});

test('yields', function (assert) {
  assert.expect(2);
  var component = this.subject({
    layout: hbs`yield me`,
  });
  assert.equal(component._state, 'preRender');
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('can lookup components in its layout', function (assert) {
  assert.expect(1);
  var component = this.subject({
    layout: hbs`{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}`,
  });
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('clears out views from test to test', function (assert) {
  assert.expect(1);
  this.subject({
    layout: hbs`{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}`,
  });
  this.render();
  assert.ok(true, 'rendered without id already being used from another test');
});

///////////////////////////////////////////////////////////////////////////////

moduleForComponent('pretty-color', {
  beforeSetup: function () {
    setupRegistry();
  },
});

test('className', function (assert) {
  // first call to this.$() renders the component.
  assert.ok(this.$().is('.pretty-color'));
});

test('template', function (assert) {
  var component = this.subject();

  assert.equal($.trim(this.$().text()), 'Pretty Color:');

  Ember.run(function () {
    component.set('name', 'green');
  });

  assert.equal($.trim(this.$().text()), 'Pretty Color: green');
});

test('$', function (assert) {
  this.subject({ name: 'green' });
  assert.equal($.trim(this.$('.color-name').text()), 'green');
  assert.equal($.trim(this.$().text()), 'Pretty Color: green');
});
