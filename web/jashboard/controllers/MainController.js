(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, menuDelegate, dashboardDelegate, monitorDelegate, pluginManager, repository) {
      var onDataLoadSuccess = function(data) {
        scope.$broadcast("DataLoadingComplete");
        scope.dashboards = [];
        _.each(data, function(dashboard) {
          scope.dashboards.push(dashboard);
        });
        scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
        scope.$apply();
      };
      var onDataLoadError = function(status, statusMessage) {
        scope.$broadcast("DataLoadingError");
        scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
        scope.$apply();
      };

      scope.loadData = function() {
        scope.$broadcast("DataLoadingStart");
        repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
      };

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      menuDelegate.init(scope);
      dashboardDelegate.init(scope);
      monitorDelegate.init(scope);
    }
  });
  jashboard.application.controller("MainController", 
    ['$scope',
     'MenuControllerDelegate',
     'DashboardControllerDelegate',
     'MonitorControllerDelegate',
     'PluginManager',
     'Repository',
     jashboard.MainController]).run(function() {
    steal.dev.log("MainController initialized");
  });
}(jashboard || {}));
