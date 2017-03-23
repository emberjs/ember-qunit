/* global setTimeout */

import Ember from 'ember';
import { module, test, buildIntegrationOptions } from 'ember-qunit';
import setupRegistry from './test-support/setup-registry';

module('component:x-foo', buildIntegrationOptions({
  before: setupRegistry
}));

test('renders', function(assert) {
  assert.expect(1);

  this.render(Ember.Handlebars.compile(`{{pretty-color name="red"}}`));

  assert.equal(this.$('.color-name').text(), 'red');
});
