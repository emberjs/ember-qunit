define("ember", ["exports"], function(__exports__) {
  __exports__["default"] = window.Ember;
});

var emberQUnit = requireModule("ember-qunit");

for (var exportName in emberQUnit) {
  window[exportName] = emberQUnit[exportName];
}
