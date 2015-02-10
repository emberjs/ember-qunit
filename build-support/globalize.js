define("ember", ["exports"], function(__exports__) {
  __exports__["default"] = window.Ember;
});

var emberQunit = requireModule("ember-qunit");

window.moduleFor = emberQunit.moduleFor;
window.moduleForComponent = emberQunit.moduleForComponent;
window.moduleForModel = emberQunit.moduleForModel;
window.test = emberQunit.test;
window.setResolver = emberQunit.setResolver;
