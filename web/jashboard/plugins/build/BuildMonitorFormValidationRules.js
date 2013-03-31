(function(module) {
  jashboard = _.extend(module, {
    BuildMonitorFormValidationRules: function(scope) {
      var serverPortRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();

      var requiredRuleForBuildType = function(type, buildProperty) {
        if (scope.inputMonitor.configuration.build.type === type) {
          return jashboard.commonValidationRules.required(scope.inputMonitor.configuration.build[buildProperty]);
        } else {
          return jashboard.commonValidationRules.noValidation();
        }
      };

      this.serverName = function() { return jashboard.commonValidationRules.required(scope.inputMonitor.configuration.build.hostname); };
      this.serverPort = function() { return serverPortRule(scope.inputMonitor.configuration.build.port); };
      this.jenkins_build_id = function() { return requiredRuleForBuildType("jenkins", "build_id"); };
      this.go_pipeline = function() { return requiredRuleForBuildType("go", "pipeline"); };
      this.go_stage = function() { return requiredRuleForBuildType("go", "stage"); };
      this.go_job = function() { return requiredRuleForBuildType("go", "job"); };
    }
  });
}(jashboard || {}));
