jashboard.DashboardController = function(scope, httpService) {
  httpService.getJSON("/ajax/dashboards")
  .success(function(data) {
    scope.dashboards = _.map(data, function(item) { return new jashboard.model.Dashboard(item); });
    scope.$apply();
  });
};

jashboard.application.controller("DashboardController", ['$scope', 'httpService', jashboard.DashboardController]);
