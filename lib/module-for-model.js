import moduleFor from './module-for';
import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForModel } from './builder';

export default = qunitModule(builderForModel, function(context, defaultSubject, products) {
  context.__setup_properties__.store = products.store;
  if (context.__setup_properties__.subject === defaultSubject) {
    context.__setup_properties__.subject = products.subject;
  }
});
