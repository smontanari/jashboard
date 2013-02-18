jashboard.MonitorControllerDelegate = function(repository) {
  this.updateMonitorRuntime = function(scope, monitor) {
    repository.loadMonitorRuntimeInfo(
      monitor.id,
      monitor.type,
      monitor.runtimeInfoSynchroniser(function() {
        scope.$apply();
      })
    );
  };

  this.init = function(scope) {
    var self = this;
    scope.$on("NewMonitorCreated", function(event, dashboard_id, monitor) {
      var dashboard = _.find(scope.dashboards, function(dashboard) {
        return (dashboard.id === dashboard_id);
      });
      dashboard.monitors.push(monitor);
      self.updateMonitorRuntime(scope, monitor);
      scope.$apply();
    });
  }


  // scope.$on("MonitorPositionChanged", function(event, monitorElement, monitorPosition) {
  //   steal.dev.log(monitorElement.getAttribute("id"));
  //   steal.dev.log(monitorPosition);
  // });
};

jashboard.services.service('MonitorControllerDelegate', ['Repository', jashboard.MonitorControllerDelegate]).run(function() {
  steal.dev.log("MonitorControllerDelegate initialized");
});