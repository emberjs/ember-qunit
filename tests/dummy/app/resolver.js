import Resolver from 'ember-resolver';

export let registry = Object.create(null);
export function setRegistry(newRegistry) {
  registry = newRegistry;
}

export default Resolver.extend({
  resolve(fullName) {
    return registry[fullName] || this._super(...arguments);
  },
});
