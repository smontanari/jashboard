(function(module) {
  jashboard = _.extend(module, {
    DashboardActionsHandler: function(repository, alertService) {
      this.init = function(scope) {
        var dashboardActions = {
          newMonitor: function(currentScope) {
            scope.$broadcast("OpenMonitorDialog", currentScope.dashboard.id);
          },
          delete: function(currentScope) {
            alertService.showAlert({
              title: "Remove dashboard test-dashboard",
              message: "Deleting this dashboard will also remove all its monitors. Continue?",
              confirmLabel: "Delete",
              confirmAction: function() {
                repository.deleteDashboard(currentScope.dashboard.id, {
                  success: function() {
                    scope.$broadcast("RemoveDashboard", currentScope.dashboard);
                  }
                });
              }
            });
          }
        };
        
        scope.dashboardAction = function(name) {
          dashboardActions[name](this);
        };
      };
    }
  });
  jashboard.application.service('DashboardActionsHandler', ['Repository', 'AlertService', jashboard.DashboardActionsHandler]).run(function() {
    steal.dev.log("DashboardActionsHandler initialized");
  });
}(jashboard || {}));
