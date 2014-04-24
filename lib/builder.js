import Ember from 'ember';
import isolatedContainer from './isolated-container';

function builder(fullName, needs, resolver) {
  var container = isolatedContainer([fullName].concat(needs || []), resolver);
  var factory = function() {
    return container.lookupFactory(fullName);
  };
  return {
    container: container,
    factory: factory
  };
};

function builderForModel(name, needs, resolver) {
  var result = builder('model:' + name, needs, resolver);

  if (DS._setupContainer) {
    DS._setupContainer(result.container);
  } else {
    result.container.register('store:main', DS.Store);
  }

  var adapterFactory = result.container.lookupFactory('adapter:application');
  if (!adapterFactory) {
    result.container.register('adapter:application', DS.FixtureAdapter);
  }

  result.store = function() {
    return result.container.lookup('store:main');
  };

  result.subject = function(options) {
    return Ember.run(function() {
      return result.container.lookup('store:main').createRecord(name, options);
    });
  };

  return result;
}

function builderForComponent(name, needs, resolver) {
  var result = builder('component:' + name, needs, resolver);
  var layoutName = 'template:components/' + name;
  var layout = resolver.resolve(layoutName);

  if (layout) {
    result.container.register(layoutName, layout);
    result.container.injection('component:' + name, 'layout', layoutName);
  }

  result.dispatcher = Ember.EventDispatcher.create();
  result.dispatcher.setup({}, '#ember-testing');

  result.append = function(subjectFn) {
    return function(selector) {
      var containerView = Ember.ContainerView.create({container: result.container});
      var view = Ember.run(function(){
        var subject = subjectFn();
        containerView.pushObject(subject);
        // TODO: destory this somewhere
        containerView.appendTo('#ember-testing');
        return subject;
      });

      return view.$();
    };
  };

  return result;
}

export {
  builder,
  builderForModel,
  builderForComponent
};
