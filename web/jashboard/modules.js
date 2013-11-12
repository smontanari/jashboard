(function() {
  var jashboard = {
    services: angular.module('jashboard.services', []),
    application: angular.module('jashboard', ['jashboard.services', 'ui']),
    plugin: {}
  };
  window.jashboard = jashboard;
})();
