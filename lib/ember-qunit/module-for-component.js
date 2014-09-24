import { createModule } from './qunit-module';
import { TestModuleForComponent } from 'ember-test-helpers';

export default function moduleForComponent(name, description, callbacks) {
  createModule(TestModuleForComponent, name, description, callbacks);
}
