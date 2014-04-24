import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForComponent } from './builder';

export default = qunitModule(builderForComponent, function(products, context) {
  context.dispatcher = products.dispatcher;
  context.__setup_properties__.append = products.append(function() { return context.subject() });
  context.__setup_properties__.$ = context.__setup_properties__.append;
});
