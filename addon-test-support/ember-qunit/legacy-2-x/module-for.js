import { createModule } from './qunit-module';
import { TestModule } from 'ember-test-helpers';

export default function moduleFor(name, description, callbacks) {
  createModule(TestModule, name, description, callbacks);
}
