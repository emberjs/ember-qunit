/* eslint-env node */
'use strict';

const path = require('path');
const resolvePackagePath = require('resolve-package-path');
const stripIndent = require('common-tags').stripIndent;

const validatePeerDependencies = require('validate-peer-dependencies');

module.exports = {
  name: 'ember-qunit',

  init() {
    this._super.init && this._super.init.apply(this, arguments);

    this.setTestGenerator();
  },

  included() {
    this._super.included.apply(this, arguments);

    validatePeerDependencies(__dirname, {
      resolvePackagePathFrom: this.parent.root,
    });

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

    let scopedInputTree = new Funnel(tree, { destDir: 'ember-qunit' });

    return this.preprocessJs(scopedInputTree, '/', this.name, {
      annotation: `ember-qunit - treeForAddonTestSupport`,
      registry: this.registry,
      treeType: 'addon-test-support',
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
