import Ember               from 'ember';
import isolatedContainer   from './isolated-container';
import moduleFor           from './module-for';
import moduleForComponent  from './module-for-component';
import test                from './test';
import testResolver        from './test-resolver';
import equal               from './equal';
import getAssertionMessage from './get-assertion-message';
import strictEqual         from './strict-equal';

Ember.testing = true;

function setResolver(resolver) {
  testResolver.set(resolver);
}

function globalize() {
  window.moduleFor = moduleFor;
  window.moduleForComponent = moduleForComponent;
  window.test = test;
  window.setResolver = setResolver;
  window.equal = equal;
  window.strictEqual = strictEqual;
  window.getAssertionMessage = getAssertionMessage;
}

export {
  globalize,
  moduleFor,
  moduleForComponent,
  test,
  setResolver,
  equal,
  strictEqual,
  getAssertionMessage
};
