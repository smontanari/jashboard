jashboard.MenuController = function(scope) {
  scope.actionNewDashboard = function() {
    scope.$broadcast("OpenDashboardDialog");
  };
};

jashboard.application.controller("MenuController", ['$scope', jashboard.MenuController]).run(function() {
  steal.dev.log("MenuController initialized");
});

