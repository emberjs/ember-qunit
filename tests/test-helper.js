import { application } from './helpers/resolver';
import { start } from 'ember-qunit';
import { setApplication } from '@ember/test-helpers';

setApplication(application);
start();
