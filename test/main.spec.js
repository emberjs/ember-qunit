emq.globalize();

var Post = DS.Model.extend({
  title: DS.attr(),
  user: DS.attr(),
  comments: DS.hasMany('comment')
});

var Comment = DS.Model.extend({
  post: DS.belongsTo('post')
});

function upcase (value) {
  return value.toUpperCase();
};

var registry = {
  'component:x-foo': Ember.Component.extend(),
  'route:foo': Ember.Route.extend(),
  'controller:foos': Ember.ArrayController.extend(),
  'controller:bar': Ember.Controller.extend({
    needs: ['foos']
  }),
  'model:post': Post,
  'model:comment': Comment,
  'helper:upcase': upcase
};

var Resolver = Ember.DefaultResolver.extend({
  resolve: function(fullName) {
    return registry[fullName] || this._super.apply(this, arguments);
  }
});

setResolver(Resolver.create());



//moduleForRoute('foo', 'FooRoute');

//test('creates route instance', function() {
  //expect(1);
  //var route = this.subject();
  //ok(route instanceof registry['route:foo']);
//});



//moduleForController('bar', 'BarController');

//test('creates controller instance', function() {
  //expect(1);
  //var controller = this.subject();
  //ok(controller instanceof registry['controller:bar']);
//});

moduleFor('controller:bar', 'moduleFor with bar controller', {
  needs: ['controller:foos']
});

test('exists', function() {
  var bar = this.subject();
  
  foos = bar.get('controllers.foos');
  
  ok(bar);
  ok(bar instanceof Ember.Controller);
  ok(foos instanceof Ember.ArrayController);
});

test('exists again', function() {
  var bar = this.subject();
  
  foos = bar.get('controllers.foos');

  ok(bar);
  ok(bar instanceof Ember.Controller);
  ok(foos instanceof Ember.ArrayController);
});

moduleForModel('post', 'moduleForModel with post', {
  needs: ['model:comment']
});

test('exists', function() {
  var post = this.subject({title: 'A title for a post', user: 'bob'});
  ok(post);
  ok(post instanceof DS.Model);
  ok(post instanceof Post);
});

moduleForHelper('upcase', 'moduleForHelper');

test('with unbound helper renders', function() {
  expect(3);
  var snippet = this.subject({
    template: '{{upcase name}}',
    context: { name: 'Robert' }
  });
  equal(snippet.state, 'preRender');
  this.append()
  equal(snippet.state, 'inDOM');
  equal(snippet.$().text(), 'ROBERT');
});

test('with bound helper renders', function() {
  expect(2);
  var templateContext = { name: 'Tomster' };
  var snippet = this.subject({
    template: '{{upcase name}}',
    context: templateContext
  });
  this.append()
  equal(snippet.$().text(), 'TOMSTER');
  Ember.run(function(){
    Ember.set(templateContext, 'name', 'Ember');  
  });
  equal(snippet.$().text(), 'EMBER');  
});

moduleForHelper('upcase', 'moduleForHelper with custom setup/teardown', {
  setup: function() {
    ok(true, 'custom setup ran');
  },
  teardown: function() {
    ok(true, 'custom teardown ran');
  }
});

test('performs custom setup and teardown', function() {
  expect(2);
});

moduleForComponent('x-foo', 'moduleForComponent with x-foo');

test('renders', function() {
  expect(2);
  var component = this.subject();
  equal(component.state, 'preRender');
  this.append();
  equal(component.state, 'inDOM');
});

test('yields', function() {
  expect(2);
  var component = this.subject({
    template: "yield me".compile()
  });
  equal(component.state, 'preRender');
  this.append();
  equal(component.state, 'inDOM');
});

test('can lookup components in its template', function() {
  expect(1);
  var component = this.subject({
    template: "{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}".compile()
  });
  this.append();
  equal(component.state, 'inDOM');
});

test('clears out views from test to test', function() {
  expect(1);
  var component = this.subject({
    template: "{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}".compile()
  });
  this.append();
  ok(true, 'rendered without id already being used from another test');
});
