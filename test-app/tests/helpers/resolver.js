export function setResolverRegistry(owner, registry) {
  for (let [key, value] of Object.entries(registry)) {
    owner.register(key, value);
  }
}
