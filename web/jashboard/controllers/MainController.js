(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, dashboardDelegate, pluginManager) {
      var menuActions = {
        newDashboard: function() {
          scope.$broadcast("OpenDashboardDialog");
        }
      };
      
      scope.menuAction = function(name) {
        menuActions[name]();
      }

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      dashboardDelegate.init(scope);
    }
  });
  jashboard.application.controller("MainController", ['$scope', 'DashboardControllerDelegate', 'PluginManager', jashboard.MainController]).run(function() {
    steal.dev.log("MainController initialized");
  });
}(jashboard || {}));
