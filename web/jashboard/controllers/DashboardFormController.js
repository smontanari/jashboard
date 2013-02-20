(function(module) {
  jashboard = _.extend(module, {
    DashboardFormController: function(scope, repository) {
      scope.saveDashboard = function() {
        if (scope.dashboardName == "") {
          scope.validationError = true;
          return;
        }
        repository.createDashboard({name: this.dashboardName}, function(dashboard) {
          scope.$emit("NewDashboardCreated", dashboard);
        });
        scope.$emit("CloseDashboardDialog");
      };

      scope.$on("OpenDashboardDialog", function(event) {
        scope.dashboardName = "";
        scope.validationError = false;
      });
    }
  });
  jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
    steal.dev.log("DashboardFormController initialized");
  });
}(jashboard || {}));
