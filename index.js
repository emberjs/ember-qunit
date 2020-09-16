/* eslint-env node */
'use strict';

const path = require('path');
const resolvePackagePath = require('resolve-package-path');
const semver = require('semver');
const SilentError = require('silent-error');
const stripIndent = require('common-tags').stripIndent;

// avoid checking multiple times from the same location
let HAS_PEER_DEPS_INSTALLED = new Map();
function hasPeerDependenciesInstalled(parentRoot) {
  if (HAS_PEER_DEPS_INSTALLED.has(parentRoot)) {
    return HAS_PEER_DEPS_INSTALLED.get(parentRoot);
  }

  let peerDependencies = require('./package').peerDependencies;

  for (let packageName in peerDependencies) {
    let minimumVersion = peerDependencies[packageName].substring(1);

    let packagePath = resolvePackagePath(packageName, parentRoot);
    if (packagePath === null) {
      HAS_PEER_DEPS_INSTALLED.set(parentRoot, false);
      return false;
    }

    let packageVersion = require(packagePath).version;
    if (semver.lt(packageVersion, minimumVersion)) {
      HAS_PEER_DEPS_INSTALLED.set(parentRoot, false);
      return false;
    }
  }

  HAS_PEER_DEPS_INSTALLED.set(parentRoot, true);
  return true;
}

module.exports = {
  name: 'ember-qunit',

  init() {
    this._super.init && this._super.init.apply(this, arguments);

    this.setTestGenerator();
  },

  included() {
    this._super.included.apply(this, arguments);

    if (!hasPeerDependenciesInstalled(this.parent.root)) {
      let peerDependencies = require('./package').peerDependencies;
      let packages = Object.keys(peerDependencies).map(
        (name) => `"${name}@${peerDependencies[name]}"`
      );
      let hasYarnLock = this.project.has('yarn.lock');

      let installMessage = `${
        hasYarnLock ? 'yarn add' : 'npm install'
      } --dev ${packages.join(' ')}`;

      throw new SilentError(
        `ember-qunit now requires that \`qunit\` and \`@ember/test-helpers\` are \`devDependencies\` of the project. Please run:\n\t${installMessage}`
      );
    }

    // TODO: figure out how to make this not needed, AFAICT ember-auto-import
    // does not provide any ability to import styles
    this.import('vendor/qunit/qunit.css', { type: 'test' });

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
      this._targetOptions = targetOptions || {};
    }

    return this._targetOptions;
  },

  treeForVendor: function (tree) {
    const MergeTrees = require('broccoli-merge-trees');
    const Funnel = require('broccoli-funnel');

    let qunitPackagePath = resolvePackagePath('qunit', this.parent.root);
    let qunitPath = path.join(path.dirname(qunitPackagePath), 'qunit');

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

    const Funnel = require('broccoli-funnel');

    let babel = this.addons.find((a) => a.name === 'ember-cli-babel');

    return babel.transpileTree(new Funnel(tree, { destDir: 'ember-qunit' }));
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
