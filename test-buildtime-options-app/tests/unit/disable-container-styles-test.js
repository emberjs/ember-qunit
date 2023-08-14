import { module, test } from 'qunit';
import { assert as debugAssert } from '@ember/debug';

module('disableContainerStyles', function () {
  function style(element) {
    return window.getComputedStyle(element);
  }

  test('the styles are not present', async function (assert) {
    let qunitFixture = document.getElementById('qunit-fixture');
    let emberTestingContainer = document.getElementById(
      'ember-testing-container'
    );
    let emberTesting = document.getElementById('ember-testing');

    debugAssert(`#qunit-fixture must exist`, qunitFixture);
    debugAssert(`#ember-testing-container must exist`, emberTestingContainer);
    debugAssert(`#ember-testing must exist`, emberTesting);

    // Defaults
    assert.strictEqual(style(qunitFixture).position, 'absolute');
    assert.strictEqual(style(emberTestingContainer).position, 'static');
    assert.strictEqual(style(emberTesting).transformOrigin, '500px 0px');
  });
});
