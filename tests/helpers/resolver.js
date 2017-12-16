import App from '../../app';
import { setRegistry } from '../../resolver';
import config from '../../config/environment';
import { setResolver } from 'ember-test-helpers';

export const application = App.create(config.APP);
export const resolver = application.Resolver.create({
  namespace: application,
  isResolverFromTestHelpers: true,
});

export default resolver;

setResolver(resolver);

export function setResolverRegistry(registry) {
  setRegistry(registry);
}
