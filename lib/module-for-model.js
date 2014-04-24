import moduleFor from './module-for';
import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForModel } from './builder';

export default = qunitModule(builderForModel, function(fullName, container, context, defaultSubject) {
  var name = fullName.split(':', 2).pop();

  context.__setup_properties__.store = function(){
    return container.lookup('store:main');
  };

  if (context.__setup_properties__.subject === defaultSubject) {
    context.__setup_properties__.subject = function(options) {
      return Ember.run(function() {
        return container.lookup('store:main').createRecord(name, options);
      });
    };
  }
});
