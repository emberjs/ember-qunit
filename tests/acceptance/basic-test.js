import { module, test } from 'qunit';
import EmberRouter from '@ember/routing/router';
import Route from '@ember/routing/route';
import hbs from 'htmlbars-inline-precompile';
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

  const Router = EmberRouter.extend({ location: 'none' });
  Router.map(function () {
    this.route('widgets');
    this.route('posts', function () {
      this.route('post', { path: ':post_id' });
    });
  });

  hooks.beforeEach(function () {
    setResolverRegistry({
      'router:main': Router,
      'template:application': hbs`
        <div class="nav">{{link-to 'posts' 'posts'}} | {{link-to 'widgets' 'widgets'}}</div>
        {{outlet}}
      `,
      'template:index': hbs`<h1>Hello World!</h1>`,
      'template:posts': hbs`<h1>Posts Page</h1>{{outlet}}`,
      'template:posts/post': hbs`<div class="post-id">{{model.post_id}}</div>`,
      'route:posts/post': Route.extend({
        model(params) {
          return params;
        },
      }),
    });
  });

  setupApplicationTest(hooks);

  test('can render', async function (assert) {
    await visit('/');

    assert.equal(currentRouteName(), 'index');
    assert.equal(currentURL(), '/');

    assert.equal(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.equal(this.element.querySelector('h1').textContent, 'Hello World!');
  });

  test('can perform a basic template rendering for nested route', async function (assert) {
    await visit('/posts/1');

    assert.equal(currentRouteName(), 'posts.post');
    assert.equal(currentURL(), '/posts/1');

    assert.equal(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.equal(this.element.querySelector('.post-id').textContent, '1');
  });

  test('can visit multiple times', async function (assert) {
    await visit('/posts/1');

    assert.equal(currentRouteName(), 'posts.post');
    assert.equal(currentURL(), '/posts/1');

    assert.equal(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.equal(this.element.querySelector('.post-id').textContent, '1');

    await visit('/');

    assert.equal(currentRouteName(), 'index');
    assert.equal(currentURL(), '/');

    assert.equal(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.equal(this.element.querySelector('h1').textContent, 'Hello World!');

    await visit('/posts/2');

    assert.equal(currentRouteName(), 'posts.post');
    assert.equal(currentURL(), '/posts/2');

    assert.equal(
      this.element.querySelector('.nav').textContent,
      'posts | widgets'
    );
    assert.equal(this.element.querySelector('.post-id').textContent, '2');
  });

  test('can navigate amongst routes', async function (assert) {
    await visit('/');

    assert.equal(currentRouteName(), 'index');
    assert.equal(currentURL(), '/');

    await click('a[href="/posts"]');

    assert.equal(currentRouteName(), 'posts.index');
    assert.equal(currentURL(), '/posts');

    assert.equal(this.element.querySelector('h1').textContent, 'Posts Page');
  });
});
