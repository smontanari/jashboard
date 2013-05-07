(function(module) {
  jashboard = _.extend(module, {
    services: angular.module('jashboard.services', []),
    application: angular.module('jashboard', ['jashboard.services', 'ui']),
    plugin: {}
  });
}(jashboard || {}));
