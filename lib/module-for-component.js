import moduleFor from './module-for';
import Ember from 'ember';
import { qunitModule } from './module-for';
import { builderForComponent } from './builder';

export default = qunitModule(builderForComponent, function(fullName, container, context, defaultSubject) {
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
});
