emq.globalize();

var registry = {
  'component:x-foo': Ember.Component.extend(),
  'route:foo': Ember.Route.extend(),
  'controller:bar': Ember.Controller.extend()
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

