jashboard.DashboardActionsController = function(scope) {
  scope.actionNewMonitor = function() {
    scope.$broadcast("OpenMonitorDialog");
  };
};

jashboard.application.controller("DashboardActionsController", ['$scope', jashboard.DashboardActionsController]).run(function() {
  steal.dev.log("DashboardActionsController initialized");
});


