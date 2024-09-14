/* eslint-disable ember/no-classic-components */
import { module, test } from 'qunit';
import Component, { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';
import { helper } from '@ember/component/helper';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { macroCondition, dependencySatisfies } from '@embroider/macros';

module('setupRenderingTest tests', function (hooks) {
  setupRenderingTest(hooks);

  test('can render a simple template', async function (assert) {
    await render(hbs`<p>Hello!</p>`);

    assert.strictEqual(this.element.textContent, 'Hello!');
  });

  test('can invoke template only components', async function (assert) {
    if (
      macroCondition(dependencySatisfies('ember-source', '>= 6.0.0-alpha.0'))
    ) {
      this.owner.register(
        'component:template-only',
        setComponentTemplate(hbs`template-only component here`, templateOnly())
      );
    } else {
      this.owner.register(
        'template:components/template-only',
        hbs`template-only component here`
      );
    }

    await render(hbs`<TemplateOnly />`);

    assert.strictEqual(
      this.element.textContent,
      'template-only component here'
    );
  });

  test('can invoke JS only components', async function (assert) {
    this.owner.register(
      'component:js-only',
      // eslint-disable-next-line ember/no-classic-classes
      Component.extend({
        classNames: ['js-only'],
      })
    );

    await render(hbs`<JsOnly />`);

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

    assert.strictEqual(this.element.textContent, 'max-jax');
  });
});
