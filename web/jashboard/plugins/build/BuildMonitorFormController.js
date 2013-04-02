(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      var buildTypes = jashboard.plugin.build.buildConfigurationParser.getAllRegisteredTypes();
      scope.availableCiServerTypes = buildTypes;
      scope.buildMonitorFormValidator = new jashboard.FormValidator(new jashboard.BuildMonitorFormValidationRules(scope));
      
      scope.setCiServerType = function(type) {
        scope.inputMonitor.configuration.build.type = type;
        scope.buildMonitorFormValidator.onInputChange();
      }

      scope.$on("NewMonitorDialog", function(event) {
        scope.inputMonitor.configuration.build = {
          type: _.first(buildTypes)
        };
        scope.buildMonitorFormValidator.prepareForm(scope.buildMonitorForm);
        scope.formHelper.registerMonitorTypeForm("build", scope.buildMonitorForm);
      });
    }
  });
  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugin.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
}(jashboard.plugin.build || {}));
