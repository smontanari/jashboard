jashboard.DashboardFormController = function(scope, repository, dialogService) {
  var dashboardFormSelector = "#new-dashboard-form";
  
  scope.saveDashboard = function() {
    repository.createDashboard({name: this.dashboardName}, function(dashboard) {
      scope.$emit("NewDashboardCreated", dashboard);
    });
    dialogService.hideModal(dashboardFormSelector);
  };

  scope.$on("OpenDashboardDialog", function(event) {
    scope.dashboardName = "";
    dialogService.showModal(dashboardFormSelector);
  });
};

jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', 'DialogService', jashboard.DashboardFormController]).run(function() {
  steal.dev.log("DashboardFormController initialized");
});

