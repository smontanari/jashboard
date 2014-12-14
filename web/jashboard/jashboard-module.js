(function() {
  var jashboard = {
    services: angular.module('jashboard.services', []),
    application: angular.module('jashboard', ['jashboard.services', 'ui.keypress', 'ngRoute']),
    plugin: {},
    dependencies: {},
    run: function() {
      angular.bootstrap(document, ['jashboard']);
    }
  };
  if (typeof define === 'function') {
    define(['moment'], function(moment) {
      jashboard.dependencies.moment = moment;
      return jashboard;
    });
  } else {
    jashboard.dependencies.moment = moment;
  }
  this.jashboard = jashboard;
}).call(this);