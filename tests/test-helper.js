import resolver from './helpers/resolver';
import { setResolver, start } from 'ember-qunit';

setResolver(resolver);
start();
