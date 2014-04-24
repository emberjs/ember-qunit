import moduleFor from './module-for';
import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForModel } from './builder';

function delegate(fullName, container, context, defaultSubject) {
  var name = fullName.split(':', 2).pop();

  if (DS._setupContainer) {
    DS._setupContainer(container);
  } else {
    container.register('store:main', DS.Store);
  }

  var adapterFactory = container.lookupFactory('adapter:application');
  if (!adapterFactory) {
    container.register('adapter:application', DS.FixtureAdapter);
  }

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
}

export default = qunitModule(builderForModel, delegate);
