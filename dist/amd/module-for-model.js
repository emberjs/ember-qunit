define(
  ["./module-for","ember","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moduleFor = __dependency1__["default"] || __dependency1__;
    var Ember = __dependency2__["default"] || __dependency2__;
    var qunitModule = __dependency1__.qunitModule;
    var builderForModel = __dependency3__.builderForModel;

    __exports__["default"] = qunitModule(builderForModel, function(products, context, options) {
      context.__setup_properties__.store = products.store;
      context.__setup_properties__.subject = options.subjectIsDefault ?
        products.subject : context.__setup_properties__.subject;
    });
  });