(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, dashboardDelegate, monitorDelegate, pluginManager) {
      var menuActions = {
        newDashboard: function() {
          scope.$broadcast("OpenDashboardDialog");
        }
      };
      var dashboardActions = {
        newMonitor: function(currentScope) {
          scope.$broadcast("OpenMonitorDialog", currentScope.dashboard.id);
        }
      };
      
      scope.menuAction = function(name) {
        menuActions[name]();
      }
      scope.dashboardAction = function(name) {
        dashboardActions[name](this);
      };

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      dashboardDelegate.init(scope);
      monitorDelegate.init(scope);
    }
  });
  jashboard.application.controller("MainController", ['$scope', 'DashboardControllerDelegate', 'MonitorControllerDelegate', 'PluginManager', jashboard.MainController]).run(function() {
    steal.dev.log("MainController initialized");
  });
}(jashboard || {}));
