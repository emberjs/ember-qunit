/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    name: 'test-app',
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    packageRules: [
      {
        // See: https://github.com/embroider-build/embroider/issues/522
        package: 'test-app',
        components: {
          '{{template-only}}': {
            safeToIgnore: true,
          },
          '{{js-only}}': {
            safeToIgnore: true,
          },
          '{{jax}}': {
            safeToIgnore: true,
          },
        },
      },
    ],
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
