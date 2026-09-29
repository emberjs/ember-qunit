import * as QUnit from 'qunit';

QUnit.config.autostart = false;
QUnit.config.urlConfig.push({
  id: 'nocontainer',
  label: 'Hide container'
});
QUnit.config.urlConfig.push({
  id: 'devmode',
  label: 'Development mode'
});
QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds
//# sourceMappingURL=qunit-configuration.js.map
