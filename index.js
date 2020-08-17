/* eslint-env node */
'use strict';

const path = require('path');
const VersionChecker = require('ember-cli-version-checker');
const SilentError = require('silent-error');
const stripIndent = require('common-tags').stripIndent;

module.exports = {
  name: 'ember-qunit',

  init() {
    this._super.init && this._super.init.apply(this, arguments);

    this.setTestGenerator();
  },

  included() {
    this._super.included.apply(this, arguments);

    let peerDependencies = require('./package').peerDependencies;
    let checker = VersionChecker.forProject(this.project);

    if (!checker.check(peerDependencies)) {
      let packageNames = Object.keys(peerDependencies).map(
        (name) => peerDependencies[name]
      );
      let hasYarnLock = this.project.has('yarn.lock');

      let installMessage = hasYarnLock
        ? `yarn add --dev ${packageNames.join(' ')}`
        : `npm install --dev ${packageNames.join(' ')}`;

      throw new SilentError(
        `ember-qunit now requires that \`qunit\` and \`@ember/test-helpers\` are \`devDependencies\` of the project. Please run:\n\t${installMessage}`
      );
    }

    // TODO: remove these `this.import` statements when the app is using using Embroider or ember-auto-import
    this.import('vendor/qunit/qunit.js', { type: 'test' });
    this.import('vendor/qunit/qunit.css', { type: 'test' });
    this.import('vendor/ember-qunit/qunit-configuration.js', { type: 'test' });

    let addonOptions = this.targetOptions();
    let explicitlyDisabledStyles = addonOptions.disableContainerStyles === true;
    if (!explicitlyDisabledStyles) {
      this.import('vendor/ember-qunit/test-container-styles.css', {
        type: 'test',
      });
    }
  },

  targetOptions() {
    if (!this._targetOptions) {
      // 1. check this.parent.options['ember-qunit']
      let targetOptions =
        this.parent.options && this.parent.options['ember-qunit'];
      // 2. check this.app.options['ember-qunit']
      targetOptions =
        targetOptions ||
        (this.app && this.app.options && this.app.options['ember-qunit']);
      // 3. check this.parent.options['ember-cli-qunit']
      targetOptions =
        targetOptions ||
        (this.parent.options && this.parent.options['ember-cli-qunit']);
      // 4. check this.app.options['ember-cli-qunit']
      targetOptions =
        targetOptions ||
        (this.app && this.app.options && this.app.options['ember-cli-qunit']);
      this._targetOptions = targetOptions || {};
    }

    return this._targetOptions;
  },

  treeForVendor: function (tree) {
    const MergeTrees = require('broccoli-merge-trees');
    const Funnel = require('broccoli-funnel');
    let qunitPath = path.dirname(require.resolve('qunit'));

    let qunitTree = new Funnel(this.treeGenerator(qunitPath), {
      destDir: 'qunit',
      annotation: 'ember-qunit#treeForVendor',
    });

    return new MergeTrees([qunitTree, tree]);
  },

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { ... } from 'ember-qunit';

    return this.preprocessJs(tree, '/', this.name, {
      registry: this.registry,
    });
  },

  setTestGenerator: function () {
    this.project.generateTestFile = function (moduleName, tests) {
      let output = `QUnit.module('${moduleName}');\n`;

      tests.forEach(function (test) {
        output += stripIndent`
          QUnit.test('${test.name}', function(assert) {
            assert.expect(1);
            assert.ok(${test.passed}, '${test.errorMessage}');
          });
        `;
      });

      return output;
    };
  },
};
