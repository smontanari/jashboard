var jashboard = (function(jashboard) {
  jashboard.services = angular.module('jashboard.services', []);
  jashboard.application = angular.module('jashboard', ['jashboard.services']);

  return jashboard;
}(jashboard || {}));