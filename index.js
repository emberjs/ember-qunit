/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'ember-qunit',

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/qunit/qunit.js', { type: 'test' });
    this.import('vendor/qunit/qunit.css', { type: 'test' });
  },

  targetOptions() {
    if (!this._targetOptions) {
      // 1. check this.parent.options['ember-qunit']
      let targetOptions = this.parent.options && this.parent.options['ember-qunit'];
      // 2. check this.app.options['ember-qunit']
      targetOptions = targetOptions || this.app && this.app.options && this.app.options['ember-qunit'];
      // 3. check this.parent.options['ember-cli-qunit']
      targetOptions = targetOptions || this.parent.options && this.parent.options['ember-cli-qunit'];
      // 4. check this.app.options['ember-cli-qunit']
      targetOptions = targetOptions || this.app && this.app.options && this.app.options['ember-cli-qunit'];
      this._targetOptions = targetOptions || {};
    }

    return this._targetOptions;
  },

  contentFor: function(type) {
    // Skip if insertContentForTestBody === false.
    if (type === 'test-body' && !(this.targetOptions().insertContentForTestBody === false)) {
      return `
        <div id="qunit"></div>
        <div id="qunit-fixture"></div>

        <div id="ember-testing-container">
          <div id="ember-testing"></div>
        </div>
      `;
    }
  },

  treeForVendor: function() {
    const Funnel = require('broccoli-funnel');
    let qunitPath = path.dirname(require.resolve('qunitjs'));

    return new Funnel(this.treeGenerator(qunitPath), {
      destDir: 'qunit',
      annotation: 'ember-qunit#treeForVendor',
    });
  },

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { ... } from 'ember-qunit';

    return this.preprocessJs(tree, '/', this.name, {
      registry: this.registry,
    });
  },
};
