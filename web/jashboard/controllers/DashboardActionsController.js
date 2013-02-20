(function(module) {
  jashboard = _.extend(module, {
    DashboardActionsController: function(scope) {
      scope.actionNewMonitor = function() {
        scope.$broadcast("OpenMonitorDialog", this.dashboard.id);
      };
    }
  });
  jashboard.application.controller("DashboardActionsController", ['$scope', jashboard.DashboardActionsController]).run(function() {
    steal.dev.log("DashboardActionsController initialized");
  });
}(jashboard || {}));

