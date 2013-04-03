(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      var buildTypes = jashboard.plugin.build.buildConfigurationParser.getAllRegisteredTypes();
      scope.availableCiServerTypes = buildTypes;
      scope.buildMonitorFormValidator = new jashboard.FormValidator(new jashboard.BuildMonitorFormValidationRules(scope));
      
      scope.setCiServerType = function(type) {
        scope.monitorConfigurationData.build.type = type;
        scope.buildMonitorFormValidator.onInputChange();
      }

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationData.build = {
            type: _.first(buildTypes)
          };
          scope.buildMonitorFormValidator.prepareForm(scope.buildMonitorForm, true);
        } else if (options.parameters.monitor.type === 'build') {
          scope.monitorConfigurationData.build = options.parameters.monitor.configuration;
          scope.buildMonitorFormValidator.prepareForm(scope.buildMonitorForm, false);
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
