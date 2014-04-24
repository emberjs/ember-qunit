define(
  ["./module-for","ember","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;
    var qunitModule = __dependency1__.qunitModule;
    var builderForComponent = __dependency3__.builderForComponent;

    __exports__["default"] = qunitModule(builderForComponent, function(context, defaultSubject, products) {
      context.dispatcher = products.dispatcher;
      context.__setup_properties__.append = products.append(function() { return context.subject() });
      context.__setup_properties__.$ = context.__setup_properties__.append;
    });
  });