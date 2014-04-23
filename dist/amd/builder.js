define(
  ["ember","./isolated-container","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var isolatedContainer = __dependency2__["default"] || __dependency2__;

    function builder(fullName, needs) {
      var container = isolatedContainer([fullName].concat(needs || []));
      var factory = function() {
        return container.lookupFactory(fullName);
      };
      return {
        container: container,
        factory: factory
      };
    };

    function builderForModel(name, needs) {
      return builder('model:' + name, needs);
    }

    function builderForComponent(name, needs) {
      return builder('component:' + name, needs);
    }

    __exports__.builder = builder;
    __exports__.builderForModel = builderForModel;
    __exports__.builderForComponent = builderForComponent;
  });