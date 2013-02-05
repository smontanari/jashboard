jashboard.DashboardContentController = function(scope) {
  scope.actionNewMonitor = function() {
    scope.$broadcast("OpenMonitorDialog", this.dashboard.id);
  };
};

jashboard.application.controller("DashboardContentController", ['$scope', jashboard.DashboardContentController]).run(function() {
  steal.dev.log("DashboardContentController initialized");
});
