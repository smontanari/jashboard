(function(module) {
  jashboard = _.extend(module, {
    DashboardActionsHandler: function(repository, alertService, timeoutService) {
      this.init = function(applicationScope) {
        var dashboardActions = {
          newMonitor: function(currentScope) {
            applicationScope.$broadcast("OpenMonitorDialog", currentScope.dashboard.id);
          },
          delete: function(currentScope) {
            alertService.showAlert({
              title: "Remove dashboard test-dashboard",
              message: "Deleting this dashboard will also remove all its monitors. Continue?",
              confirmLabel: "Delete",
              confirmAction: function() {
                applicationScope.$broadcast("DashboardDeleteStart");
                repository.deleteDashboard(currentScope.dashboard.id, {
                  success: function() {
                    applicationScope.dashboards = _.without(applicationScope.dashboards, currentScope.dashboard);
                    jashboard.scopeContextHelper.setDefaultActiveDashboard.apply(applicationScope);
                    applicationScope.$apply();
                    applicationScope.$broadcast("DashboardDeleteComplete");
                    _.each(currentScope.dashboard.monitors, function(monitor) {
                      if (_.isObject(monitor.runtimeUpdateScheduler)) {
                        timeoutService.cancel(monitor.runtimeUpdateScheduler);
                      }
                    });
                  },
                  error: function() {
                    applicationScope.$broadcast("AjaxError");
                  }
                });
              }
            });
          }
        };
        
        applicationScope.dashboardAction = function(name) {
          dashboardActions[name](this);
        };
      };
    }
  });
  jashboard.application.service('DashboardActionsHandler', ['Repository', 'AlertService', '$timeout', jashboard.DashboardActionsHandler]).run(function() {
    steal.dev.log("DashboardActionsHandler initialized");
  });
}(jashboard || {}));
