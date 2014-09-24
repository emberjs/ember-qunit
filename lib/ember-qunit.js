import moduleFor          from 'ember-qunit/module-for';
import moduleForComponent from 'ember-qunit/module-for-component';
import moduleForModel     from 'ember-qunit/module-for-model';
import test               from 'ember-qunit/test';
import { setResolver }    from 'ember-test-helpers';

function globalize() {
  window.moduleFor = moduleFor;
  window.moduleForComponent = moduleForComponent;
  window.moduleForModel = moduleForModel;
  window.test = test;
  window.setResolver = setResolver;
}

export {
  globalize,
  moduleFor,
  moduleForComponent,
  moduleForModel,
  test,
  setResolver
};
