jashboard.MainController = function(scope, repository) {
  scope.dashboards = [];
  //var loadMonitor = function(dashboard_id, monitor_id) {
    //http.getJSON("/ajax/monitor/" + monitor_id)
    //.success(function(monitor_data) { addMonitor(dashboard_id, monitor_data); });
  //};

  var addDashboard = function(dashboard) {
    //var dashboard = new jashboard.model.Dashboard(dashboard_data);
    scope.dashboards.push(dashboard);
    _.each(dashboard.monitors, updateMonitorRuntime);
    //_.each(dashboard_data.monitor_ids, function(monitor_id) {
      //loadMonitor(dashboard_data.id, monitor_id);
    //});
  };

  var updateMonitorRuntime = function(monitor) {
    repository.loadMonitorRuntime(monitor.id, function(runtimeInfo) {
      monitor.runtimeInfo = runtimeInfo;
      scope.$apply();
    });
    //dashboard.monitors.push(new jashboard.model.Monitor(monitor_data));
    //scope.$apply();
  };

  //scope.$on('NewDashboardEvent', function(event, dashboard_data) {
  //});
  //scope.$on("NewMonitorEvent", function(event, dashboard_id, monitor_data) {
  //});

  repository.loadDashboards(function(data) {
    scope.dashboards = [];
    _.each(data, addDashboard);
    scope.$apply();
  });
};

jashboard.application.controller("MainController", ['$scope', 'Repository', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
