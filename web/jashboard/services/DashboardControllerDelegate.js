(function(module) {
  jashboard = _.extend(module, {
    DashboardControllerDelegate: function(repository) {
      this.init = function(scope) {
        var onDataLoadSuccess = function(data) {
          scope.$broadcast("DataLoadingComplete");
          scope.dashboards = [];
          _.each(data, function(dashboard) {
            scope.dashboards.push(dashboard);
          });
          scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
          scope.$apply();
        };
        var onDataLoadError = function(status, statusMessage) {
          scope.$broadcast("DataLoadingError");
          scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
          scope.$apply();
        };

        scope.$on('NewDashboardCreated', function(event, dashboard) {
          scope.dashboards.push(dashboard);
          scope.$apply();
        });

        scope.loadDashboardData = function() {
          scope.$broadcast("DataLoadingStart");
          repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
        };
      };
    }
  });
  jashboard.services.service('DashboardControllerDelegate', ['Repository', jashboard.DashboardControllerDelegate]).run(function() {
    steal.dev.log("DashboardControllerDelegate initialized");
  });
}(jashboard || {}));
