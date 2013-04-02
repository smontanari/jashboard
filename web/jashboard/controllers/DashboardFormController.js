(function(module) {
  jashboard = _.extend(module, {
    DashboardFormController: function(scope, repository) {
      var formValidator = new jashboard.FormValidator(new jashboard.DashboardFormValidationRules(scope));
      var onSuccessfulCreate = function(dashboard) {
        scope.dashboards.push(dashboard);
        scope.context.activeDashboardId = dashboard.id;
        scope.$apply();
        scope.$emit("DashboardSaveComplete");
      };
      var onSuccessfulUpdate = function() {
        var dashboard = _.find(scope.dashboards, function(d) {return d.id === scope.inputDashboard.id});
        dashboard.name = scope.inputDashboard.name;
        scope.$apply();
        scope.$emit("DashboardSaveComplete");
      };
      var onError = function() {
        scope.$emit("AjaxError");
      };
      scope.saveDashboard = function() {
        scope.$emit("DashboardSaveStart");
        if (scope.editMode === jashboard.inputOptions.createMode) {
          repository.createDashboard({name: scope.inputDashboard.name}, {
            success: onSuccessfulCreate,
            error: onError
          });
        } else {
          repository.updateDashboard(scope.inputDashboard, {
            success: onSuccessfulUpdate,
            error: onError
          });
        }
        scope.$emit("CloseDashboardDialog");
      };

      scope.$on("OpenDashboardDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.inputDashboard = {};
          formValidator.prepareForm(scope.dashboardForm, true);
        } else {
          scope.inputDashboard = _.pick(options.parameters.dashboard, "id", "name");
          formValidator.prepareForm(scope.dashboardForm, false);
        }
        scope.editMode = options.mode;
        scope.dashboardFormValidator = formValidator;
      });
    }
  });
  jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
    steal.dev.log("DashboardFormController initialized");
  });
}(jashboard || {}));
