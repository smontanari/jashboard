(function(module) {
  jashboard = _.extend(module, {
    DashboardControllerDelegate: function(repository, monitorDelegate) {
      this.init = function(scope) {
        var addDashboard = function(dashboard) {
          scope.dashboards.push(dashboard);
          _.each(dashboard.monitors, function(monitor) {
            monitorDelegate.updateMonitorRuntime(scope, monitor);
          });
        };

        scope.$evalAsync(function(aScope) {
          aScope.$broadcast("DataLoadingStart");
        });

        repository.loadDashboards(function(data) {
          scope.$broadcast("DataLoadingComplete");
          scope.dashboards = [];
          _.each(data, addDashboard);
          scope.$apply();
        });

        scope.$on('NewDashboardCreated', function(event, dashboard) {
          addDashboard(dashboard);
          scope.$apply();
        });

        monitorDelegate.init(scope);
      };
    }
  });
  jashboard.services.service('DashboardControllerDelegate', ['Repository', 'MonitorControllerDelegate', jashboard.DashboardControllerDelegate]).run(function() {
    steal.dev.log("DashboardControllerDelegate initialized");
  });
}(jashboard || {}));
