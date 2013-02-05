jashboard.MainController = function(scope, repository, pluginManager) {
  scope.dashboards = [];

  var addDashboard = function(dashboard) {
    scope.dashboards.push(dashboard);
    _.each(dashboard.monitors, updateMonitorRuntime);
    scope.$apply();
  };

  var updateMonitorRuntime = function(monitor) {
    repository.loadMonitorRuntimeInfo(monitor.id, monitor.type, function(runtimeInfo) {
      monitor.runtimeInfo = runtimeInfo;
      scope.$apply();
    });
  };

  //scope.$on("NewMonitorCreated", function(event, dashboard_id, monitor_data) {
  //});

  scope.$on('NewDashboardEvent', function(event, dashboard) {
    addDashboard(dashboard);
  });

  repository.loadDashboards(function(data) {
    scope.dashboards = [];
    _.each(data, addDashboard);
  });

  scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
};

jashboard.application.controller("MainController", ['$scope', 'Repository', 'PluginManager', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
