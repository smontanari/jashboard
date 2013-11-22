(function() {
  var jashboard = {
    services: angular.module('jashboard.services', []),
    application: angular.module('jashboard', ['jashboard.services', 'ui.keypress', 'ngRoute']),
    plugin: {}
  };
  window.jashboard = jashboard;
})();
