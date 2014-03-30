emq.globalize();

var Post = DS.Model.extend({ 
  title: DS.attr(),
  user: DS.attr(),
  comments: DS.hasMany('comment')
});
var Comment = DS.Model.extend({
  post: DS.belongsTo('post')
});

var PrettyColor = Ember.Component.extend({
  classNames: ['pretty-color'],
  attributeBindings: ['style'],
  style: function(){
    return 'color: ' + this.get('name') + ';';
  }.property('name')
});

var registry = {
  'component:x-foo': Ember.Component.extend(),
  'component:pretty-color': PrettyColor,
  'template:components/pretty-color': "Pretty Color: {{name}}".compile(),
  'route:foo': Ember.Route.extend(),
  'controller:foos': Ember.ArrayController.extend(),
  'controller:bar': Ember.Controller.extend({
    needs: ['foos']
  }),
  'model:post': Post,
  'model:comment': Comment
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

moduleForComponent('pretty-color', 'moduleForComponent with pretty-color');

test("className", function(){
  // first call to this.$() renders the component.
  ok(this.$().is('.pretty-color'));
});

test("template", function(){
  var component = this.subject();

  equal($.trim(this.$().text()), 'Pretty Color:');

  Ember.run(function(){
    component.set('name', 'green');
  });

  equal($.trim(this.$().text()), 'Pretty Color: green');
});