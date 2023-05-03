import { module, test } from 'qunit';
import EmberRouter from '@ember/routing/router';
import Route from '@ember/routing/route';
import { hbs } from 'ember-cli-htmlbars';
import { setupApplicationTest } from 'ember-qunit';
import {
  visit,
  currentRouteName,
  currentURL,
  click,
} from '@ember/test-helpers';
import { setResolverRegistry } from '../helpers/resolver';
import hasEmberVersion from '@ember/test-helpers/has-ember-version';

module('setupApplicationTest tests', function (hooks) {
  if (!hasEmberVersion(2, 4)) {
    return;
  }

  class Router extends EmberRouter {
    location = 'none';
  }
  Router.map(function () {
    this.route('widgets');
    this.route('posts', function () {
      this.route('post', { path: ':post_id' });
    });
  });

  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    setResolverRegistry(this.owner, {
      'router:main': Router,
      'template:application': hbs`
        <div class="nav"><LinkTo @route="posts">posts</LinkTo> | <LinkTo @route="widgets">widgets</LinkTo></div>
        {{outlet}}
      `,
      'template:index': hbs`<h1>Hello World!</h1>`,
      'template:posts': hbs`<h1>Posts Page</h1>{{outlet}}`,
      'template:posts/post': hbs`<div class="post-id">{{this.model.post_id}}</div>`,
      'route:posts/post': class extends Route {
        model(params) {
          return params;
        }
      },
    });
  });

  test('can render', async function (assert) {
    await visit('/');

    assert.strictEqual(currentRouteName(), 'index');
    assert.strictEqual(currentURL(), '/');

    assert.strictEqual(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.strictEqual(
      this.element.querySelector('h1').textContent,
      'Hello World!'
    );
  });

  test('can perform a basic template rendering for nested route', async function (assert) {
    await visit('/posts/1');

    assert.strictEqual(currentRouteName(), 'posts.post');
    assert.strictEqual(currentURL(), '/posts/1');

    assert.strictEqual(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.strictEqual(this.element.querySelector('.post-id').textContent, '1');
  });

  test('can visit multiple times', async function (assert) {
    await visit('/posts/1');

    assert.strictEqual(currentRouteName(), 'posts.post');
    assert.strictEqual(currentURL(), '/posts/1');

    assert.strictEqual(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.strictEqual(this.element.querySelector('.post-id').textContent, '1');

    await visit('/');

    assert.strictEqual(currentRouteName(), 'index');
    assert.strictEqual(currentURL(), '/');

    assert.strictEqual(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.strictEqual(
      this.element.querySelector('h1').textContent,
      'Hello World!'
    );

    await visit('/posts/2');

    assert.strictEqual(currentRouteName(), 'posts.post');
    assert.strictEqual(currentURL(), '/posts/2');

    assert.strictEqual(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.strictEqual(this.element.querySelector('.post-id').textContent, '2');
  });

  test('can navigate amongst routes', async function (assert) {
    await visit('/');

    assert.strictEqual(currentRouteName(), 'index');
    assert.strictEqual(currentURL(), '/');

    await click('a[href="/posts"]');

    assert.strictEqual(currentRouteName(), 'posts.index');
    assert.strictEqual(currentURL(), '/posts');

    assert.strictEqual(
      this.element.querySelector('h1').textContent,
      'Posts Page'
    );
  });
});
