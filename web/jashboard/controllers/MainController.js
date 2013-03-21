(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, locationService, menuDelegate, dashboardDelegate, repository) {
      var onDataLoadSuccess = function(data) {
        scope.dashboards = [];
        _.each(data, function(dashboard) {
          scope.dashboards.push(dashboard);
        });
        scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
        scope.$apply();
        scope.$broadcast("DataLoadingComplete");
      };
      var onDataLoadError = function(status, statusMessage) {
        scope.$broadcast("DataLoadingError");
        scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
        scope.$apply();
      };

      scope.locationService = locationService;
      scope.showDashboard = function(e) {
        scope.$broadcast("DashboardVisible", this.dashboard.id);
      };
      scope.$on("OverlayReady", function(event) {
        scope.$broadcast("DataLoadingStart");
        repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
        event.stopPropagation();
      });
      menuDelegate.init(scope);
      dashboardDelegate.init(scope);
    }
  });
  jashboard.application.controller("MainController", 
    ['$scope',
     '$location',
     'MenuControllerDelegate',
     'DashboardActionsHandler',
     'Repository',
     jashboard.MainController]).run(function() {
    steal.dev.log("MainController initialized");
  });
}(jashboard || {}));
