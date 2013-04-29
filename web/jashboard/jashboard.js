var jashboard = (function(module) {
  module.services = angular.module('jashboard.services', []);
  module.application = angular.module('jashboard', ['jashboard.services', 'ui']);
  module.plugin = {};

  return module;
}(jashboard || {}));