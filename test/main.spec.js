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


var Whazzit = DS.Model.extend({ gear: DS.attr('string') });
var whazzitCreateRecordCalled = false;
var WhazzitAdapter = DS.FixtureAdapter.extend({
  createRecord: function(){
    whazzitCreateRecordCalled = true;
    return this._super.apply(this, arguments);
  }
});

var ApplicationAdapter = DS.FixtureAdapter.extend();

var registry = {
  'component:x-foo': Ember.Component.extend(),
  'component:pretty-color': PrettyColor,
  'template:components/pretty-color': 'Pretty Color: <span class="color-name">{{name}}</span>'.compile(),
  'route:foo': Ember.Route.extend(),
  'controller:foos': Ember.ArrayController.extend(),
  'controller:hello-world': Ember.ObjectController.extend(),
  'controller:bar': Ember.Controller.extend({
    needs: ['foos', 'helloWorld']
  }),
  'model:post': Post,
  'model:comment': Comment,
  'model:whazzit': Whazzit,
  'adapter:whazzit': WhazzitAdapter,
  'adapter:application': ApplicationAdapter,
};

var Resolver = Ember.DefaultResolver.extend({
  resolve: function(fullName) {
    return registry[fullName] || this._super.apply(this, arguments);
  },
  normalize: function(fullName) {
    return Ember.String.dasherize(fullName);
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
  needs: ['controller:foos', 'controller:helloWorld']
});

test('exists', function() {
  var bar = this.subject();

  var foos = bar.get('controllers.foos');
  var helloWorld = bar.get('controllers.helloWorld');

  ok(bar);
  ok(bar instanceof Ember.Controller);
  ok(foos instanceof Ember.ArrayController);
  ok(helloWorld instanceof Ember.ObjectController);
});

test('exists again', function() {
  var bar = this.subject();

  var foos = bar.get('controllers.foos');
  var helloWorld = bar.get('controllers.helloWorld');

  ok(bar);
  ok(bar instanceof Ember.Controller);
  ok(foos instanceof Ember.ArrayController);
  ok(helloWorld instanceof Ember.ObjectController);
});

moduleForModel('whazzit', 'moduleForModel whazzit without adapter');

test('store exists', function() {
  var store = this.store();
  ok(store instanceof DS.Store);
});

test('model exists as subject', function() {
  var model = this.subject();
  ok(model);
  ok(model instanceof DS.Model);
  ok(model instanceof Whazzit);
});

test('model is using the FixtureAdapter', function() {
  var model = this.subject(),
      store = this.store();

  ok(store.adapterFor(model.constructor) instanceof DS.FixtureAdapter);
  ok(!(store.adapterFor(model.constructor) instanceof WhazzitAdapter));
});

moduleForModel('whazzit', 'moduleForModel whazzit with adapter', {
  needs: ['adapter:whazzit'],
  teardown: function(){
    whazzitCreateRecordCalled = false;
  }
});

test('model is using the WhazzitAdapter', function() {
  var model = this.subject(),
      store = this.store();

  ok(store.adapterFor(model.constructor) instanceof WhazzitAdapter);
});

if (DS._setupContainer) {
  test('creates the custom adapter', function() {
    expect(2);
    ok(!whazzitCreateRecordCalled, 'precond - custom adapter is not yet instantiated');

    var model = this.subject();

    return Ember.run(function(){
      model.set('gear', '42');
      return model.save().then(function(){
        ok(whazzitCreateRecordCalled, 'uses the custom adapter');
      });
    });
  });
} else {
  test('without DS._setupContainer fails to create the custom adapter', function() {
    var thrown = false;
    try {
      var model = this.subject();
      Ember.run(function(){
        model.set('gear', '42');
        return model.save();
      });
    } catch(e) {
      thrown = true;
    }
    ok(thrown, 'error is thrown without DS._setupContainer');
  });
}


moduleForModel('whazzit', 'moduleForModel whazzit with application adapter', {
  needs: ['adapter:application']
});

test('model is using the ApplicationAdapter', function() {
  var model = this.subject(),
      store = this.store();

  ok(store.adapterFor(model.constructor) instanceof ApplicationAdapter);
  ok(!(store.adapterFor(model.constructor) instanceof WhazzitAdapter));
});

moduleForComponent('x-foo', 'moduleForComponent with x-foo');

test('renders', function() {
  expect(2);
  var component = this.subject();
  equal(component.state, 'preRender');
  this.render();
  equal(component.state, 'inDOM');
});

test('append', function() {
  expect(3);
  var component = this.subject();
  equal(component.state, 'preRender');
  this.append();
  equal(component.state, 'inDOM');
  equal(Ember.deprecationWarnings.pop(), 'this.append() is deprecated. Please use this.render() instead.');
});

test('yields', function() {
  expect(2);
  var component = this.subject({
    layout: "yield me".compile()
  });
  equal(component.state, 'preRender');
  this.render();
  equal(component.state, 'inDOM');
});

test('can lookup components in its layout', function() {
  expect(1);
  var component = this.subject({
    layout: "{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}".compile()
  });
  this.render();
  equal(component.state, 'inDOM');
});

test('clears out views from test to test', function() {
  expect(1);
  var component = this.subject({
    layout: "{{x-foo id='yodawg-i-heard-you-liked-x-foo-in-ur-x-foo'}}".compile()
  });
  this.render();
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

test("$", function(){
  var component = this.subject({name: 'green'});
  equal($.trim(this.$('.color-name').text()), 'green');
  equal($.trim(this.$().text()), 'Pretty Color: green');
});
