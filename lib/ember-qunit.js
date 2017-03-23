import moduleFor            from 'ember-qunit/module-for';
import moduleForComponent   from 'ember-qunit/module-for-component';
import moduleForModel       from 'ember-qunit/module-for-model';
import QUnitAdapter         from 'ember-qunit/adapter';
import setupTestFactory     from 'ember-qunit/setup-test-factory';
import {
  setResolver,
  TestModule,
  TestModuleForIntegration,
  TestModuleForAcceptance
} from 'ember-test-helpers';

export { module, test, skip, only, todo } from 'qunit';

const setupTest = setupTestFactory(TestModule);
const setupAcceptanceTest = setupTestFactory(TestModuleForAcceptance);
const setupIntegrationTest = setupTestFactory(TestModuleForIntegration);

export {
  moduleFor,
  moduleForComponent,
  moduleForModel,
  setupTest,
  setupAcceptanceTest,
  setupIntegrationTest,
  setResolver,
  QUnitAdapter
};
