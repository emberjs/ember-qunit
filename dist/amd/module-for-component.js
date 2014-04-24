define(
  ["ember","./module-for","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__.qunitModule;
    var builderForComponent = __dependency3__.builderForComponent;

    __exports__["default"] = qunitModule(builderForComponent, function(products, context) {
      context.dispatcher = products.dispatcher;
      context.__setup_properties__.append = products.append(function() { return context.subject() });
      context.__setup_properties__.$ = context.__setup_properties__.append;
    });
  });