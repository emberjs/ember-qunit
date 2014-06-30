var getUrlGenerator = function(App, name) {
  var forEach = Ember.ArrayPolyfills.forEach,
    filter = Ember.ArrayPolyfills.filter;

  return function(params) {
    var recognizer = App.__container__
      .lookup('router:main')
      .get('router.recognizer');
    if (!(name in recognizer.names)) {
      throw new Error('Route `' + name + '` not found');
    }

    var args = [].slice.call(arguments);

    if (Ember.typeOf(params) === 'string' || args.length > 1) {
      params = {};

      var segments = recognizer.names[name].segments;

      forEach.call(filter.call(segments, function(segment) {
        return !!segment.name;
      }), function(segment, i) {
        if (!(i in args)) {
          throw new Error('Not enough arguments passed for each Dynamic Segment');
        }
        params[segment.name] = args[i].toString();
      });
    }

    return recognizer.generate(name, params);
  };
};

export default function moduleForApp(name, description, callbacks) {
  if (typeof description === 'object') {
    callbacks = description;
    description = '';
  }

  var fullName = ['acceptance', name, (description || '')].join(':');

  callbacks = callbacks || {};

  var _callbacks = {
    setup: function() {
      this.App = startApp();
      this.url = getUrlGenerator(this.App, name);

      (callbacks.setup || function(){}).call(this);
    },
    teardown: function() {
      (callbacks.teardown || function(){}).call(this);

      Ember.run(this.App, 'destroy');

      Ember.$('#ember-testing').empty();
    }
  };

  QUnit.module(fullName, _callbacks);
}
