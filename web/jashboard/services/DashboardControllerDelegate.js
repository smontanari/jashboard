(function(module) {
  jashboard = _.extend(module, {
    DashboardControllerDelegate: function(repository) {
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
  jashboard.services.service('DashboardControllerDelegate', ['Repository', jashboard.DashboardControllerDelegate]).run(function() {
    steal.dev.log("DashboardControllerDelegate initialized");
  });
}(jashboard || {}));
