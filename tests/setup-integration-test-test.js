/* global setTimeout */

import Ember from 'ember';
import { module, test, setupIntegrationTest } from 'ember-qunit';
import { setResolverRegistry } from './test-support/resolver';

var PrettyColor = Ember.Component.extend({
  classNames: ['pretty-color'],
  attributeBindings: ['style'],
  style: function(){
    return 'color: ' + this.get('name') + ';';
  }.property('name')
});

function setupRegistry() {
  setResolverRegistry({
    'component:x-foo': Ember.Component.extend(),
    'component:pretty-color': PrettyColor,
    'template:components/pretty-color': Ember.Handlebars.compile('Pretty Color: <span class="color-name">{{name}}</span>')
  });
}

module('component:x-foo', function(hooks) {
  hooks.before(setupRegistry);

  setupIntegrationTest(hooks);

  test('renders', function(assert) {
    assert.expect(1);

    this.render(Ember.Handlebars.compile(`{{pretty-color name="red"}}`));

    assert.equal(this.$('.color-name').text(), 'red');
  });
});
