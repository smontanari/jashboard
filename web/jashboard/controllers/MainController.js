jashboard.MainController = function(scope, repository, overlayService, pluginManager) {
  var addDashboard = function(dashboard) {
    scope.dashboards.push(dashboard);
    _.each(dashboard.monitors, updateMonitorRuntime);
    scope.$apply();
  };

  var updateMonitorRuntime = function(monitor) {
    repository.loadMonitorRuntimeInfo(monitor.id, monitor.type, function(runtimeInfo) {
      monitor.updateRuntimeInfo(runtimeInfo);
      scope.$apply();
    });
  };

  var init = function() {
    overlayService.show("#waiting-overlay");
    scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();

    repository.loadDashboards(function(data) {
      overlayService.hide();
      scope.dashboards = [];
      _.each(data, addDashboard);
    });
  };

  scope.$on("NewMonitorCreated", function(event, dashboard_id, monitor) {
    var dashboard = _.find(scope.dashboards, function(dashboard) {
      return (dashboard.id === dashboard_id);
    });
    dashboard.monitors.push(monitor);
    scope.$apply();
    updateMonitorRuntime(monitor);
  });

  scope.$on('NewDashboardCreated', function(event, dashboard) {
    addDashboard(dashboard);
  });

  init();
};

jashboard.application.controller("MainController", ['$scope', 'Repository', 'OverlayService', 'PluginManager', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
