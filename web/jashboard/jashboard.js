var jashboard = (function(module) {
  module.services = angular.module('jashboard.services', []);
  module.plugins = angular.module('jashboard.plugins', ['jashboard.services']);
  module.application = angular.module('jashboard', ['jashboard.services', 'jashboard.plugins', 'ui']);

  return module;
}(jashboard || {}));