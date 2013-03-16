(function(module) {
  jashboard = _.extend(module, {
    DashboardActionsHandler: function(repository) {
      this.init = function(scope) {
        var dashboardActions = {
          newMonitor: function(currentScope) {
            scope.$broadcast("OpenMonitorDialog", currentScope.dashboard.id);
          }
        };
        
        scope.dashboardAction = function(name) {
          dashboardActions[name](this);
        };
      };
    }
  });
  jashboard.application.service('DashboardActionsHandler', ['Repository', jashboard.DashboardActionsHandler]).run(function() {
    steal.dev.log("DashboardActionsHandler initialized");
  });
}(jashboard || {}));
