jashboard.DashboardContentController = function(scope) {
  scope.actionNewMonitor = function() {
    scope.$broadcast("OpenMonitorDialog");
  };

  scope.monitorRuntimeView = function() {
    return "html/plugins/" + this.monitor.type + "/monitor_runtime_view.html";
  };
};

jashboard.application.controller("DashboardContentController", ['$scope', jashboard.DashboardContentController]).run(function() {
  steal.dev.log("DashboardContentController initialized");
});
