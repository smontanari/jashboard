jashboard.defineNamespace("jashboard.plugins.build", function() {
  jashboard.plugins.build.BuildMonitorFormController = function(scope) {
    scope.availableBuildSettingsTypes = jashboard.plugin.build.buildConfigurationTypeAdapter.getAllRegisteredTypes();
    
    scope.buildSettingsFormView = function() {
      return "html/plugins/build/" + this.settingsType + "_monitor_settings_form_view.html";
    };
  };

  jashboard.application.controller("BuildMonitorFormController", ['$scope', jashboard.plugins.build.BuildMonitorFormController])
    .run(function() {
      steal.dev.log("BuildMonitorFormController initialized");
  });
});