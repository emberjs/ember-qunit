define(
  ["./test-resolver","ember","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var testResolver = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;

    __exports__["default"] = function isolatedContainer(fullNames) {
      var resolver = testResolver.get();
      var container = new Ember.Container();
      var normalize = function(fullName) {
        return resolver.normalize(fullName);
      };
      if (Ember.typeOf(container.normalizeFullName) === 'function') {
        container.normalizeFullName = normalize;
      } else {
        container.normalize = normalize;
      }
      container.optionsForType('component', { singleton: false });
      container.optionsForType('view', { singleton: false });
      container.optionsForType('template', { instantiate: false });
      container.optionsForType('helper', { instantiate: false });
      container.register('component-lookup:main', Ember.ComponentLookup);
      for (var i = fullNames.length; i > 0; i--) {
        var fullName = fullNames[i - 1];
        var normalizedFullName = resolver.normalize(fullName);
        container.register(fullName, resolver.resolve(normalizedFullName));
      }
      return container;
    }
  });