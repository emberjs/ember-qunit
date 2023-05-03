/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    eslint: {
      testGenerator: 'qunit',
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    packageRules: [
      {
        // See: https://github.com/embroider-build/embroider/issues/522
        package: 'dummy',
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
