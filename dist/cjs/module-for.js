"use strict";
var Ember = require("ember")["default"] || require("ember");
var qunitModule = require("./module-base")["default"] || require("./module-base");
var builder = require("./builder").builder;

exports["default"] = qunitModule(builder, null);