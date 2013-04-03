(function(module) {
  jashboard = _.extend(module, {
    DashboardFormController: function(scope, repository) {
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

      var validationRules = new jashboard.DashboardFormValidationRules(scope);
      scope.dashboardFormValidator = new jashboard.FormValidator();
      scope.$on("OpenDashboardDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.inputDashboard = {};
          scope.dashboardFormValidator.prepareFormForCreate(scope.dashboardForm, validationRules);
        } else {
          scope.inputDashboard = _.pick(options.parameters.dashboard, "id", "name");
          scope.dashboardFormValidator.prepareFormForUpdate(scope.dashboardForm, validationRules);
        }
        scope.editMode = options.mode;
      });
    }
  });
  jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController]).run(function() {
    steal.dev.log("DashboardFormController initialized");
  });
}(jashboard || {}));
