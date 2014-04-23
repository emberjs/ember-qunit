import Ember from 'ember';
import isolatedContainer from './isolated-container';

function builder(fullName, needs) {
  var container = isolatedContainer([fullName].concat(needs || []));
  var factory = function() {
    return container.lookupFactory(fullName);
  };
  return {
    container: container,
    factory: factory
  };
};

function builderForModel(name, needs) {
  return builder('model:' + name, needs);
}

function builderForComponent(name, needs) {
  return builder('component:' + name, needs);
}

export {
  builder,
  builderForModel,
  builderForComponent
};
