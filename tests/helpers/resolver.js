import Ember from 'ember';
import AppResolver from '../../resolver';
import config from '../../config/environment';
import { setResolver } from 'ember-test-helpers';

const Resolver = AppResolver.extend({
  resolve: function(fullName) {
    return this.registry[fullName] || this._super.apply(this, arguments);
  },

  normalize: function(fullName) {
    return Ember.String.dasherize(fullName);
  }
});
const resolver = Resolver.create();

resolver.namespace = {
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix
};

export default resolver;

setResolver(resolver);


export function setResolverRegistry(registry) {
  resolver.set('registry', registry);
}
