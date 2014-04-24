define(
  ["ember","./module-base","./builder","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var qunitModule = __dependency2__["default"] || __dependency2__;
    var builder = __dependency3__.builder;

    __exports__["default"] = qunitModule(builder, null);
  });