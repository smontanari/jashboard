jashboard.MainController = function(scope, dashboardDelegate, pluginManager) {
  scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
  dashboardDelegate.init(scope);
};

jashboard.application.controller("MainController", ['$scope', 'DashboardControllerDelegate', 'PluginManager', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
