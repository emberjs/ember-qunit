import { module, test } from 'qunit';
import Component from '@ember/component';
import { helper } from '@ember/component/helper';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { setResolverRegistry } from '../helpers/resolver';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

module('setupRenderingTest tests', function (hooks) {
  if (!hasEmberVersion(2, 4)) {
    return;
  }

  hooks.beforeEach(function () {
    setResolverRegistry({});
  });

  setupRenderingTest(hooks);

  test('can render a simple template', async function (assert) {
    await render(hbs`<p>Hello!</p>`);

    assert.equal(this.element.textContent, 'Hello!');
  });

  test('can invoke template only components', async function (assert) {
    this.owner.register(
      'template:components/template-only',
      hbs`template-only component here`
    );
    await render(hbs`{{template-only}}`);

    assert.equal(this.element.textContent, 'template-only component here');
  });

  test('can invoke JS only components', async function (assert) {
    this.owner.register(
      'component:js-only',
      Component.extend({
        classNames: ['js-only'],
      })
    );

    await render(hbs`{{js-only}}`);

    assert.ok(
      this.element.querySelector('.js-only'),
      'element found for js-only component'
    );
  });

  test('can invoke helper', async function (assert) {
    this.owner.register(
      'helper:jax',
      helper(([name]) => `${name}-jax`)
    );

    await render(hbs`{{jax "max"}}`);

    assert.equal(this.element.textContent, 'max-jax');
  });
});
