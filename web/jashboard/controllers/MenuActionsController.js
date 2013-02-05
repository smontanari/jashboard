jashboard.MenuActionsController = function(scope) {
  scope.dashboardName = "";
  scope.actionNewDashboard = function() {
    scope.$broadcast("OpenDashboardDialog");
  };
};

jashboard.application.controller("MenuActionsController", ['$scope', jashboard.MenuActionsController]).run(function() {
  steal.dev.log("MenuActionsController initialized");
});

