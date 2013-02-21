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
        var onDataLoadSuccess = function(data) {
          scope.$broadcast("DataLoadingComplete");
          scope.dashboards = [];
          _.each(data, addDashboard);
          scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
          scope.$apply();
        };
        var onDataLoadError = function(status, error) {
          scope.$broadcast("DataLoadingError");
          scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
          scope.$apply();
        };

        scope.loadData = function() {
          scope.$broadcast("DataLoadingStart");
          repository.loadDashboards(onDataLoadSuccess, onDataLoadError);
        };

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
