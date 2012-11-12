jashboard.MainController = function(scope, http) {
  var loadMonitor = function(dashboard_id, monitor_id) {
    http.getJSON("/ajax/monitor/" + monitor_id)
    .success(function(monitor_data) { addMonitor(dashboard_id, monitor_data); });
  };

  var loadDashboards = function() {
    http.getJSON("/ajax/dashboards")
    .success(function(data) {
      scope.dashboards = [];
      _.each(data, addDashboard);
    });
  };

  var addDashboard = function(dashboard_data) {
    var dashboard = new jashboard.model.Dashboard(dashboard_data);
    scope.dashboards.push(dashboard);
    scope.$apply();
    _.each(dashboard_data.monitor_ids, function(monitor_id) {
      loadMonitor(dashboard_data.id, monitor_id);
    });
  };

  var addMonitor = function(dashboard_id, monitor_data) {
    var dashboard = _.find(scope.dashboards, function(dashboard) {
      return dashboard.id === dashboard_id;
    });
    dashboard.monitors.push(new jashboard.model.Monitor(monitor_data));
    scope.$apply();
  };

  //scope.$on('NewDashboardEvent', function(event, dashboard_data) {
  //});
  //scope.$on("NewMonitorEvent", function(event, dashboard_id, monitor_data) {
  //});

  loadDashboards();
};

jashboard.application.controller("MainController", ['$scope', 'httpService', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
