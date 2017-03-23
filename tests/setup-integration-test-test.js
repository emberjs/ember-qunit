/* global setTimeout */

import Ember from 'ember';
import { module, test, setupIntegrationTest } from 'ember-qunit';
import setupRegistry from './test-support/setup-registry';

module('component:x-foo', function(hooks) {
  setupIntegrationTest(hooks);

  test('renders', function(assert) {
    setupRegistry();
    assert.expect(1);

    this.render(Ember.Handlebars.compile(`{{pretty-color name="red"}}`));

    assert.equal(this.$('.color-name').text(), 'red');
  });
});
