import { module, test } from 'qunit';
import { assert as debugAssert } from '@ember/debug';

module('theme', function () {
  function style(element) {
    return window.getComputedStyle(element);
  }

  test('the qunit-default themes are present when used', async function (assert) {
    let qunitHeader = document.getElementById('qunit-header');

    debugAssert(`#qunit-header must exist`, qunitHeader);

    // Defaults
    assert.strictEqual(style(qunitHeader).backgroundColor, 'rgb(13, 51, 73)');
  });
});
