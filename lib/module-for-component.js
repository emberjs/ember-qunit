import testResolver from './test-resolver';
import moduleFor from './module-for';
import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForComponent } from './builder';


function delegate(name, resolver, container, context, defaultSubject) {
  var layoutName = 'template:components/' + name;

  var layout = resolver.resolve(layoutName);

  if (layout) {
    container.register(layoutName, layout);
    container.injection('component:' + name, 'layout', layoutName);
  }

  context.dispatcher = Ember.EventDispatcher.create();
  context.dispatcher.setup({}, '#ember-testing');

  context.__setup_properties__.append = function(selector) {
    var containerView = Ember.ContainerView.create({container: container});
    var view = Ember.run(function(){
      var subject = context.subject();
      containerView.pushObject(subject);
      // TODO: destory this somewhere
      containerView.appendTo('#ember-testing');
      return subject;
    });

    return view.$();
  };
  context.__setup_properties__.$ = context.__setup_properties__.append;
}

export default function moduleForComponent(name, description, callbacks) {
  // TODO: continue abstraction, make moduleForModel a simple assignment
  var resolver = testResolver.get();
  var del = delegate.bind(null, name, resolver);
  qunitModule(builderForComponent, del)(name, description, callbacks, del);
}
