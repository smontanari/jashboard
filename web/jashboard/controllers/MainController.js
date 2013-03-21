(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, locationService, menuDelegate, dashboardActionsHandler, repository) {
      var setCurrentActiveDashboard = function() {
        if (!_.isEmpty(scope.dashboards)) {
          scope.activeDashboardId = _.first(scope.dashboards).id;
        }
      };
      var onDataLoadSuccess = function(data) {
        scope.dashboards = [];
        _.each(data, function(dashboard) {
          scope.dashboards.push(dashboard);
        });
        scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
        setCurrentActiveDashboard();
        scope.$apply();
        scope.$broadcast("DataLoadingComplete");
      };
      var onDataLoadError = function(status, statusMessage) {
        scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
        scope.$apply();
        scope.$broadcast("DataLoadingError");
      };

      scope.locationService = locationService;
      scope.showDashboard = function() {
        scope.activeDashboardId = this.dashboard.id;
        scope.$broadcast("DashboardVisible", this.dashboard.id);
      };
      scope.isActiveDashboard = function() {
        return scope.activeDashboardId === this.dashboard.id;
      };
      scope.$on("OverlayReady", function(event) {
        scope.$broadcast("DataLoadingStart");
        repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
        event.stopPropagation();
      });
      scope.$on("RemoveDashboard", function(event, currentDashboard) {
        scope.dashboards = _.without(scope.dashboards, currentDashboard);
        setCurrentActiveDashboard();
        event.stopPropagation();
      });
      menuDelegate.init(scope);
      dashboardActionsHandler.init(scope);
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
