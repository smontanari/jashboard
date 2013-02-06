jashboard.defineNamespace("jashboard.plugins.build", function() {
  jashboard.plugins.build.BuildMonitorFormController = function(scope) {
    var buildTypes = jashboard.plugin.build.buildConfigurationTypeAdapter.getAllRegisteredTypes();
    scope.availableBuildSettingsTypes = buildTypes;
  
    scope.$on("OpenMonitorDialog", function(event) {
      scope.monitorForm.configuration = {
        type: buildTypes[0]
      };
    });

    scope.setConfigurationType = function(type) {
      scope.monitorForm.configuration.type = type;
    };
  };

  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugins.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
});