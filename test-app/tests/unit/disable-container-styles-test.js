import { module, test } from 'qunit';
import { assert as debugAssert } from '@ember/debug';

module('Default Options | disableContainerStyles', function () {
  function style(element) {
    return window.getComputedStyle(element);
  }

  test('the styles are present', async function (assert) {
    let qunitFixture = document.getElementById('qunit-fixture');
    let emberTestingContainer = document.getElementById(
      'ember-testing-container'
    );
    let emberTesting = document.getElementById('ember-testing');

    debugAssert(`#qunit-fixture must exist`, qunitFixture);
    debugAssert(`#ember-testing-container must exist`, emberTestingContainer);
    debugAssert(`#ember-testing must exist`, emberTesting);

    assert.strictEqual(style(qunitFixture).position, 'relative');
    assert.strictEqual(style(emberTestingContainer).position, 'fixed');
    assert.strictEqual(style(emberTesting).transformOrigin, '0px 0px');
  });
});
