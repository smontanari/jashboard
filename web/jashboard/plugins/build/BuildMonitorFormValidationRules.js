(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormValidationRules: function(scope) {
      var serverPortRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();

      this.serverName = function(scope) {
        if (scope.monitorConfigurationFormModel.build) {
          return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build.hostname);
        }
      };
      this.serverPort = function(scope) {
        if (scope.monitorConfigurationFormModel.build) {
          return serverPortRule(scope.monitorConfigurationFormModel.build.port);
        }
      };
    }
  });
}(jashboard.plugin.build || {}));
