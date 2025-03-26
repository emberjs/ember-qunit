'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            'ember-cli': '~4.8.1',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            'ember-cli': '~4.8.1',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
            'ember-cli': '~4.12.2',
          },
        },
      },
      {
        name: 'ember-lts-5.4',
        npm: {
          devDependencies: {
            'ember-source': '~5.4.0',
            'ember-cli': '~5.4.0',
          },
        },
      },
      {
        name: 'ember-lts-5.8',
        npm: {
          devDependencies: {
            'ember-source': '~5.8.0',
            'ember-cli': '~5.8.0',
          },
        },
      },
      {
        name: 'ember-lts-5.12',
        npm: {
          devDependencies: {
            'ember-source': '~5.12.0',
            'ember-cli': '~5.12.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          dependencies: {
            'ember-auto-import': '^2.2.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('release'),
            'ember-cli': '^5.1.0',
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          dependencies: {
            'ember-auto-import': '^2.2.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
            'ember-cli': '^5.1.0',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          dependencies: {
            'ember-auto-import': '^2.2.0',
          },
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
            'ember-cli': '^5.1.0',
          },
        },
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            'ember-cli': '^4.8.1',
          },
          ember: {
            edition: 'classic',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
