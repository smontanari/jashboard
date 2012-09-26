jashboard.DashboardController = function(scope, httpService) {
  httpService.getJSON("/ajax/dashboards.json")
  .success(function(data) {
    scope.dashboards = data;
    scope.$apply();
  });
};

jashboard.application.controller("DashboardController", ['$scope', 'httpService', jashboard.DashboardController]);
