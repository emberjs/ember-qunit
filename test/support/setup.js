String.prototype.compile = function() {
  return Ember.Handlebars.compile(this);
};

Array.prototype.compile = function() {
  return Ember.Handlebars.compile(this.join('\n'));
};

