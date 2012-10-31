jashboard.DashboardController = function(scope, http) {
  var loadMonitor = function(dashboard_id, monitor_id) {
    http.getJSON("/ajax/monitor/" + monitor_id)
    .success(function(monitor_data) {
      var dashboard = _.find(scope.dashboards, function(dashboard) {
        return dashboard.id === dashboard_id;
      });
      dashboard.monitors.push(new jashboard.model.Monitor(monitor_data));
      scope.$apply();
    });
  };

  http.getJSON("/ajax/dashboards")
  .success(function(data) {
    scope.dashboards = [];
    _.each(data, function(dashboard_data) {
      scope.dashboards.push(new jashboard.model.Dashboard(dashboard_data));
      _.each(dashboard_data.monitorRefs, function(ref) {
        loadMonitor(dashboard_data.id, ref);
      });
    });
    scope.$apply();
  });

  scope.actionNewMonitor = function() {
    $(jashboard.constants.monitorFormSelector).dialog("open");
  };
};

jashboard.application.controller("DashboardController", ['$scope', 'httpService', jashboard.DashboardController]).run(function() {
  steal.dev.log("DashboardController initialized");
});
