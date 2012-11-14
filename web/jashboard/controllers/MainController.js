jashboard.MainController = function(scope, repository) {
  scope.dashboards = [];

  var addDashboard = function(dashboard) {
    scope.dashboards.push(dashboard);
    _.each(dashboard.monitors, updateMonitorRuntime);
    scope.$apply();
  };

  var updateMonitorRuntime = function(monitor) {
    repository.loadMonitorRuntime(monitor.id, function(runtimeInfo) {
      monitor.runtimeInfo = runtimeInfo;
      scope.$apply();
    });
  };

  //scope.$on("NewMonitorEvent", function(event, dashboard_id, monitor_data) {
  //});

  scope.$on('NewDashboardEvent', function(event, dashboard) {
    addDashboard(dashboard);
  });

  repository.loadDashboards(function(data) {
    scope.dashboards = [];
    _.each(data, addDashboard);
  });

};

jashboard.application.controller("MainController", ['$scope', 'Repository', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
