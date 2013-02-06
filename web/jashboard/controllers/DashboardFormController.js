jashboard.DashboardFormController = function(scope, repository) {
  var dashboardFormSelector = "#new-dashboard-form";
  
  scope.saveDashboard = function() {
    repository.createDashboard({name: this.dashboardName}, function(dashboard) {
      scope.$emit("NewDashboardCreated", dashboard);
    });

    $(dashboardFormSelector).modal('hide');
  };

  scope.$on("OpenDashboardDialog", function(event) {
    scope.dashboardName = "";
    $(dashboardFormSelector).modal('show');
  });
};

jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
  steal.dev.log("DashboardFormController initialized");
});

