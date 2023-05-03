import { module, test } from 'qunit';
import Service, { inject as injectService } from '@ember/service';
import { setupTest } from 'ember-qunit';
import hasEmberVersion from '@ember/test-helpers/has-ember-version';

module('setupTest tests', function (hooks) {
  if (!hasEmberVersion(2, 4)) {
    return;
  }

  setupTest(hooks);

  test('can be used for unit style testing', function (assert) {
    this.owner.register(
      'service:foo',
      class extends Service {
        someMethod() {
          return 'hello thar!';
        }
      }
    );

    let subject = this.owner.lookup('service:foo');

    assert.strictEqual(subject.someMethod(), 'hello thar!');
  });

  test('can access a shared service instance', function (assert) {
    this.owner.register('service:bar', class extends Service {});
    this.owner.register(
      'service:foo',
      class extends Service {
        @injectService bar;

        someMethod() {
          this.set('bar.someProp', 'derp');
        }
      }
    );

    let subject = this.owner.lookup('service:foo');
    let bar = this.owner.lookup('service:bar');

    assert.notOk(bar.get('someProp'), 'precond - initially undefined');

    subject.someMethod();

    assert.strictEqual(bar.get('someProp'), 'derp', 'property updated');
  });
});
