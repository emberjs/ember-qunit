import { setResolver } from 'ember-test-helpers';

var Resolver = Ember.DefaultResolver.extend({
  registry: null,

  resolve: function(fullName) {
    return this.registry[fullName] || this._super.apply(this, arguments);
  },

  normalize: function(fullName) {
    return Ember.String.dasherize(fullName);
  }
});

var resolver = Resolver.create({registry: {}});
setResolver(resolver);

export function setResolverRegistry(registry) {
  resolver.set('registry', registry);
}
