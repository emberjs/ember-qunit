/* globals QUnit, define */

(function () {
  'use strict';

  define('qunit', ['exports'], function (exports) {
    exports.default = QUnit;
    exports.module = QUnit.module;
    exports.test = QUnit.test;
    exports.skip = QUnit.skip;
    exports.only = QUnit.only;
    exports.todo = QUnit.todo;
  });
})();
