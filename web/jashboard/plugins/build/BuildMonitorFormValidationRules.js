(function(module) {
  jashboard = _.extend(module, {
    BuildMonitorFormValidationRules: function(scope) {
      var rules = {
        serverName: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.commonValidationRules.required)
          .build(),
        serverPort: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.commonValidationRules.required)
          .withRule(jashboard.commonValidationRules.positiveInteger)
          .build()
      };
      
      this.serverName = function() { return rules.serverName(scope.inputMonitor.configuration.build.hostname) };
      this.serverPort = function() { return rules.serverPort(scope.inputMonitor.configuration.build.port) };
    }
  });
}(jashboard || {}));
