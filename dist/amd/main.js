define(
  ["ember","./isolated-container","./module-for","./module-for-component","./module-for-model","./module-for-helper","./test","./test-resolver","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var isolatedContainer = __dependency2__["default"] || __dependency2__;
    var moduleFor = __dependency3__["default"] || __dependency3__;
    var moduleForComponent = __dependency4__["default"] || __dependency4__;
    var moduleForModel = __dependency5__["default"] || __dependency5__;
    var moduleForHelper = __dependency6__["default"] || __dependency6__;
    var test = __dependency7__["default"] || __dependency7__;
    var testResolver = __dependency8__["default"] || __dependency8__;

    Ember.testing = true;

    function setResolver(resolver) {
      testResolver.set(resolver);
    }

    function globalize() {
      window.moduleFor = moduleFor;
      window.moduleForComponent = moduleForComponent;
      window.moduleForModel = moduleForModel;
      window.moduleForHelper = moduleForHelper;
      window.test = test;
      window.setResolver = setResolver;
    }

    __exports__.globalize = globalize;
    __exports__.moduleFor = moduleFor;
    __exports__.moduleForComponent = moduleForComponent;
    __exports__.moduleForModel = moduleForModel;
    __exports__.moduleForHelper = moduleForHelper;
    __exports__.test = test;
    __exports__.setResolver = setResolver;
  });