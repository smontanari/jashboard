jashboard.DashboardFormController = function(scope, repository) {
  var dashboardFormSelector = "#new-dashboard-form";
  
  var resetForm = function() {
    scope.dashboardForm = {name: "", refreshInterval: ""};
  };

  scope.saveDashboard = function() {
    console.log(scope.dashboardForm.name);
    repository.createDashboard(scope.dashboardForm, function(dashboard) {
      scope.$emit("NewDashboardEvent", dashboard);
    });

    $(dashboardFormSelector).modal('hide');
  };

  scope.resetDashboard = resetForm;

  scope.$on("OpenDashboardDialog", function(event) {
    $(dashboardFormSelector).modal('show');
  });

  // crap... angular does not detect some of the ui changes triggered by funcunit, so we have to force the scope change
  // this code is supposed to execute only during functional testing
  if (_.isObject(jashboard.AngularTestHelper)) {
    jashboard.AngularTestHelper.detectChange("input[name='dashboardName']", function(value) {
      scope.dashboardForm = {name: value};
      scope.$apply();
    });
  }
  resetForm();
};

jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
  steal.dev.log("DashboardFormController initialized");
});

