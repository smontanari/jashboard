(function() {
  var jashboard = {
    services: angular.module('jashboard.services', []),
    application: angular.module('jashboard', ['jashboard.services', 'ui.keypress', 'ngRoute']),
    plugin: {},
    run: function() {
      angular.bootstrap(document, ['jashboard']);
    }
  };
  if (typeof define === 'function') {
    define([], function() { return jashboard; });
  }
  this.jashboard = jashboard;
})();