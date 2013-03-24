(function(module) {
  jashboard = _.extend(module, {
    DashboardFormController: function(scope, repository) {
      scope.saveDashboard = function() {
        if (scope.dashboardName == "") {
          scope.validationError = true;
          return;
        }
        scope.$emit("DashboardCreateStart");
        repository.createDashboard({name: this.dashboardName}, {
          success: function(dashboard) {
            scope.dashboards.push(dashboard);
            scope.context.activeDashboardId = dashboard.id;
            scope.$apply();
            scope.$emit("DashboardCreateComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
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
