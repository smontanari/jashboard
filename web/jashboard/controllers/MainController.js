jashboard.MainController = function(scope, repository, pluginManager) {
  var addDashboard = function(dashboard) {
    scope.dashboards.push(dashboard);
    _.each(dashboard.monitors, updateMonitorRuntime);
  };

  var updateMonitorRuntime = function(monitor) {
    repository.loadMonitorRuntimeInfo(monitor.id, monitor.type, function(runtimeInfo) {
      monitor.updateRuntimeInfo(runtimeInfo);
      scope.$apply();
    });
  };

  var init = function() {
    scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
    scope.$evalAsync(function(aScope) {
      aScope.$broadcast("DataLoadingStart");
    });

    repository.loadDashboards(function(data) {
      scope.$broadcast("DataLoadingComplete");
      scope.dashboards = [];
      _.each(data, addDashboard);
      scope.$apply();
    });
  };

  scope.$on("NewMonitorCreated", function(event, dashboard_id, monitor) {
    var dashboard = _.find(scope.dashboards, function(dashboard) {
      return (dashboard.id === dashboard_id);
    });
    dashboard.monitors.push(monitor);
    updateMonitorRuntime(monitor);
    scope.$apply();
  });

  scope.$on('NewDashboardCreated', function(event, dashboard) {
    addDashboard(dashboard);
    scope.$apply();
  });

  // scope.$on("MonitorPositionChanged", function(event, monitorElement, monitorPosition) {
  //   steal.dev.log(monitorElement.getAttribute("id"));
  //   steal.dev.log(monitorPosition);
  // });

  init();
};

jashboard.application.controller("MainController", ['$scope', 'Repository', 'PluginManager', jashboard.MainController]).run(function() {
  steal.dev.log("MainController initialized");
});
