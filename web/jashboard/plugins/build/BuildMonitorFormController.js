(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      scope.availableCiServerTypes = jashboard.plugin.build.buildTypes;
      
      scope.setCiServerType = function(type) {
        scope.monitorConfigurationFormModel.build.type = type;
        scope.$formValidator.validate();
      }

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.model.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.build = {
            type: _.first(jashboard.plugin.build.buildTypes)
          };
        }
        scope.formHelper.registerMonitorTypeForm("build", scope.buildMonitorForm);
      });
    }
  });
  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugin.build.BuildMonitorFormController])
  .run(['$log', function(log) {
    log.info("BuildMonitorFormController initialized");
  }]);
}(jashboard.plugin.build || {}));
