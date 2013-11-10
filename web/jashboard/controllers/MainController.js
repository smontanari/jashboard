(function(module) {
  jashboard = _.extend(module, {
    MainController: function(scope, locationService, menuActionsHandler, dashboardActionsHandler, repository) {
      var onDataLoadSuccess = function(data) {
        scope.dashboards = [];
        _.each(data, function(dashboard) {
          scope.dashboards.push(dashboard);
        });
        scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
        jashboard.scopeContextHelper.setDefaultActiveDashboard.apply(scope);
        scope.$apply();
        scope.$broadcast("DataLoadingComplete");
      };
      var onDataLoadError = function(status, statusMessage) {
        scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
        scope.$apply();
        scope.$broadcast("DataLoadingError");
      };

      scope.showDashboard = function() {
        scope.context.activeDashboardId = this.dashboard.id;
        scope.$broadcast("DashboardVisible", this.dashboard.id);
      };
      scope.isActiveDashboard = function() {
        return scope.context.activeDashboardId === this.dashboard.id;
      };
      scope.loadData = function() {
        scope.$broadcast("DataLoadingStart");
        repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
      };
      scope.context = {
        currentPath: function() {return locationService.path();}
      };
      menuActionsHandler.init(scope);
      dashboardActionsHandler.init(scope);
    }
  });
  jashboard.application.controller("MainController", 
    ['$scope',
     '$location',
     'MenuActionsHandler',
     'DashboardActionsHandler',
     'Repository',
     jashboard.MainController])
  .run(['$log', function(log) {
    log.info("MainController initialized");
  }]);
}(jashboard || {}));
