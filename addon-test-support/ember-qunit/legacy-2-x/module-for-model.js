import { createModule } from './qunit-module';
import { TestModuleForModel } from 'ember-test-helpers';

export default function moduleForModel(name, description, callbacks) {
  createModule(TestModuleForModel, name, description, callbacks);
}
