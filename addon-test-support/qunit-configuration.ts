import * as QUnit from 'qunit';

QUnit.config.autostart = false;
QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container' });
QUnit.config.urlConfig.push({ id: 'nolint', label: 'Disable Linting' });
QUnit.config.urlConfig.push({ id: 'devmode', label: 'Development mode' });

// @ts-expect-error FIXME qunit types are incorrect
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds
