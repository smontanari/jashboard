(function(module) {
  jashboard = _.extend(module, {
    DashboardFormController: function(scope, repository) {
      var invokeRepository = function(repositoryFn, parameters, onSuccess) {
        scope.$emit("DashboardSaveStart");
        parameters.push({
          success: function(data) {
            onSuccess(data);
            scope.$apply();
            scope.$emit("DashboardSaveComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
        });
        repository[repositoryFn].apply(null, parameters);
        scope.$emit("CloseDashboardDialog");
      };
      var formIsValid = function() {
        return scope.dashboardForm.isValid;
      };

      var createDashboard = function() {
        invokeRepository("createDashboard", [{name: scope.dashboardFormModel.name}], function(dashboard) {
          scope.dashboards.push(dashboard);
          scope.context.activeDashboardId = dashboard.id;
        });
      };
      var updateDashboard = function() {
        invokeRepository("updateDashboard", [scope.dashboardFormModel], function() {
          var dashboard = _.find(scope.dashboards, function(d) {return d.id === scope.dashboardFormModel.id;});
          dashboard.name = scope.dashboardFormModel.name;
        });
      };

      scope.$on("OpenDashboardDialog", function(event, options) {
        if (options.mode === jashboard.model.inputOptions.createMode) {
          scope.dashboardFormModel = {};
          scope.saveDashboard = jashboard.functionUtils.deferOnCondition(formIsValid, createDashboard);
        } else if (options.mode === jashboard.model.inputOptions.updateMode) {
          scope.dashboardFormModel = _.pick(options.parameters.dashboard, "id", "name");
          scope.saveDashboard = jashboard.functionUtils.deferOnCondition(formIsValid, updateDashboard);
        }
        scope.$editMode = options.mode;
      });
    }
  });
  jashboard.application.controller("DashboardFormController", ['$scope', 'Repository', jashboard.DashboardFormController])
  .run(['$log', function(log) {
    log.info("DashboardFormController initialized");
  }]);
}(jashboard || {}));
