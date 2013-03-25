(function(module) {
  jashboard = _.extend(module, {
    DashboardActionsHandler: function(repository, alertService, timeoutService) {
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
                scope.$broadcast("DashboardDeleteStart");
                repository.deleteDashboard(currentScope.dashboard.id, {
                  success: function() {
                    scope.dashboards = _.without(scope.dashboards, currentScope.dashboard);
                    jashboard.scopeContextHelper.setDefaultActiveDashboard.apply(scope);
                    scope.$apply();
                    scope.$broadcast("DashboardDeleteComplete");
                    _.each(currentScope.dashboard.monitors, function(monitor) {
                      if (_.isObject(monitor.runtimeUpdateScheduler)) {
                        timeoutService.cancel(monitor.runtimeUpdateScheduler);
                      }
                    });
                  },
                  error: function() {
                    scope.$broadcast("AjaxError");
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
  jashboard.application.service('DashboardActionsHandler', ['Repository', 'AlertService', '$timeout', jashboard.DashboardActionsHandler]).run(function() {
    steal.dev.log("DashboardActionsHandler initialized");
  });
}(jashboard || {}));
