import Ember from 'ember';
import qunitModule from './module-base';
import { builderForModel } from './builder';

export default = qunitModule(builderForModel, function(products, context, options) {
  context.__setup_properties__.store = products.store;
  context.__setup_properties__.subject = options.subjectIsDefault ?
    products.subject : context.__setup_properties__.subject;
});
