(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormController: function(scope) {
      var buildTypes = jashboard.plugin.build.buildConfigurationParser.getAllRegisteredTypes();
      scope.availableBuildSettingsTypes = buildTypes;
    
      scope.$on("OpenMonitorDialog", function(event) {
        scope.monitorForm.configuration.build = {
          type: buildTypes[0]
        };
      });

      scope.setConfigurationType = function(type) {
        scope.monitorForm.configuration.build.type = type;
      };
    }
  });
  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugin.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
}(jashboard.plugin.build || {}));
