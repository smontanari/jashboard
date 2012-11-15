jashboard.DashboardFormController = function(scope, repository) {
  scope.saveDashboard = function() {
    repository.createDashboard(scope.dashboardForm, function(dashboard) {
      scope.$emit("NewDashboardEvent", dashboard);
    });
    $('#new-dashboard-form').modal('hide');
  };

  scope.resetForm = function() {
    scope.dashboardForm = {};
  };

  // crap... angular does not detect some of the ui changes triggered by funcunit, so we have to force the scope change
  // this code is supposed to execute only during functional testing
  if (_.isObject(jashboard.AngularTestHelper)) {
    jashboard.AngularTestHelper.detectChange("input[name='dashboardName']", function(value) {
       scope.dashboardForm = {name: value};
    });
  }
};

jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
  steal.dev.log("DashboardFormController initialized");
});

