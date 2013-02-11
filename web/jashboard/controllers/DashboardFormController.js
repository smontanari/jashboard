jashboard.DashboardFormController = function(scope, repository) {
  scope.saveDashboard = function() {
    repository.createDashboard({name: this.dashboardName}, function(dashboard) {
      scope.$emit("NewDashboardCreated", dashboard);
    });
    scope.$emit("CloseDashboardDialog");
  };

  scope.$on("OpenDashboardDialog", function(event) {
    scope.dashboardName = "";
  });
};

jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
  steal.dev.log("DashboardFormController initialized");
});

