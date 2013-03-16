(function(module) {
  jashboard = _.extend(module, {
    MainController: function(
      scope,
      locationService, 
      menuDelegate, 
      dashboardDelegate, 
      repository) {
      var onDataLoadSuccess = function(data) {
        scope.dashboards = [];
        _.each(data, function(dashboard) {
          scope.dashboards.push(dashboard);
        });
        scope.dataLoadingStatus = jashboard.model.loadingStatus.completed;
        scope.$apply();
        scope.$broadcast("DataLoadingComplete");
        // scope.$evalAsync(function() {
        //   $(".monitor-details").each(function() {
        //     var detailsPanel = $(this);
        //     var position = detailsPanel.position();
        //     var totalOffset = detailsPanel.outerHeight() - detailsPanel.height() + position.top;
        //     detailsPanel.height(detailsPanel.height() - totalOffset);
        //   });
        //   $(".monitor-panel").each(function() {
        //     var panel = $(this);
        //     console.log(panel.css("position"));
        //   });
        // });
      };
      var onDataLoadError = function(status, statusMessage) {
        scope.$broadcast("DataLoadingError");
        scope.dataLoadingStatus = jashboard.model.loadingStatus.error;
        scope.$apply();
      };

      scope.locationService = locationService;
      menuDelegate.init(scope);
      dashboardDelegate.init(scope);
      scope.$on("OverlayReady", function(event) {
        scope.$broadcast("DataLoadingStart");
        repository.loadDashboards({success: onDataLoadSuccess, error: onDataLoadError});
        event.stopPropagation();
      });
    }
  });
  jashboard.application.controller("MainController", 
    ['$scope',
     '$location',
     'MenuControllerDelegate',
     'DashboardControllerDelegate',
     'Repository',
     jashboard.MainController]).run(function() {
    steal.dev.log("MainController initialized");
  });
}(jashboard || {}));
