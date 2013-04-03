(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      var buildTypes = jashboard.plugin.build.buildDataConverter.getAllRegisteredTypes();
      var validationRules = new jashboard.BuildMonitorFormValidationRules(scope);
      scope.availableCiServerTypes = buildTypes;
      scope.buildMonitorFormValidator = new jashboard.FormValidator();
      
      scope.setCiServerType = function(type) {
        scope.monitorConfigurationFormModel.build.type = type;
        scope.buildMonitorFormValidator.triggerValidation();
      }

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.build = {
            type: _.first(buildTypes)
          };
          scope.buildMonitorFormValidator.prepareFormForCreate(scope.buildMonitorForm, validationRules);
        } else if (options.parameters.monitor.type === 'build') {
          scope.monitorConfigurationFormModel.build = options.parameters.monitor.configuration;
          scope.buildMonitorFormValidator.prepareFormForUpdate(scope.buildMonitorForm, validationRules);
        }
        scope.formHelper.registerMonitorTypeForm("build", scope.buildMonitorForm);
      });
    }
  });
  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugin.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
}(jashboard.plugin.build || {}));
