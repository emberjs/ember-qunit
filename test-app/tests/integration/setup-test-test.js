import { module, test } from 'qunit';
import Service, { inject as injectService } from '@ember/service';
import Component from '@ember/component';
import { setupTest } from 'ember-qunit';
import hasEmberVersion from '@ember/test-helpers/has-ember-version';
import { setResolverRegistry } from '../helpers/resolver';

module('setupTest tests', function (hooks) {
  if (!hasEmberVersion(2, 4)) {
    return;
  }

  hooks.beforeEach(function () {
    setResolverRegistry({});
  });

  setupTest(hooks);

  test('can be used for unit style testing', function (assert) {
    this.owner.register(
      'service:foo',
      Service.extend({
        someMethod() {
          return 'hello thar!';
        },
      })
    );

    let subject = this.owner.lookup('service:foo');

    assert.equal(subject.someMethod(), 'hello thar!');
  });

  test('can access a shared service instance', function (assert) {
    this.owner.register('service:bar', Service.extend());
    this.owner.register(
      'service:foo',
      Service.extend({
        bar: injectService(),
        someMethod() {
          this.set('bar.someProp', 'derp');
        },
      })
    );

    let subject = this.owner.lookup('service:foo');
    let bar = this.owner.lookup('service:bar');

    assert.notOk(bar.get('someProp'), 'precond - initially undefined');

    subject.someMethod();

    assert.equal(bar.get('someProp'), 'derp', 'property updated');
  });

  test('can create a component instance for direct testing without a template', function (assert) {
    this.owner.register(
      'component:foo-bar',
      Component.extend({
        someMethod() {
          return 'hello thar!';
        },
      })
    );

    let subject;
    if (hasEmberVersion(2, 12)) {
      subject = this.owner.lookup('component:foo-bar');
    } else {
      subject = this.owner._lookupFactory('component:foo-bar').create();
    }

    assert.equal(subject.someMethod(), 'hello thar!');
  });
});
