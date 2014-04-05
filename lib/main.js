import Ember              from 'ember';
import isolatedContainer  from './isolated-container';
import moduleFor          from './module-for';
import moduleForComponent from './module-for-component';
import moduleForModel     from './module-for-model';
import test               from './test';
import asyncTest          from './async-test';
import testResolver       from './test-resolver';

Ember.testing = true;

function setResolver(resolver) {
  testResolver.set(resolver);
}

function globalize() {
  window.moduleFor = moduleFor;
  window.moduleForComponent = moduleForComponent;
  window.moduleForModel = moduleForModel;
  window.test = test;
  window.asyncTest = asyncTest;
  window.setResolver = setResolver;
}

export {
  globalize,
  moduleFor,
  moduleForComponent,
  moduleForModel,
  test,
  asyncTest,
  setResolver
};
