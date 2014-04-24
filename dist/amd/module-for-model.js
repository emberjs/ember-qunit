define(
  ["ember","./module-for","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__.qunitModule;
    var builderForModel = __dependency3__.builderForModel;

    __exports__["default"] = qunitModule(builderForModel, function(products, context, options) {
      context.__setup_properties__.store = products.store;
      context.__setup_properties__.subject = options.subjectIsDefault ?
        products.subject : context.__setup_properties__.subject;
    });
  });