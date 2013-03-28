(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      var buildTypes = jashboard.plugin.build.buildConfigurationParser.getAllRegisteredTypes();
      scope.availableBuildSettingsTypes = buildTypes;
      scope.buildMonitorFormValidator = new jashboard.FormValidator(new jashboard.BuildMonitorFormValidationRules(scope));
    
      scope.$on("OpenMonitorDialog", function(event) {
        scope.inputMonitor.configuration.build = {
          type: buildTypes[0]
        };
        scope.buildMonitorFormValidator.initForm(scope.buildMonitorForm);
      });

      scope.setConfigurationType = function(type) {
        scope.inputMonitor.configuration.build.type = type;
      };
    }
  });
  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugin.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
}(jashboard.plugin.build || {}));
