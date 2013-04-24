(function(module) {
  jashboard.plugin.build = _.extend(module, {
    JenkinsMonitorFormValidationRules: function(scope) {
      this.jenkinsBuildId = function() {
        if (scope.monitorConfigurationFormModel.build.type === "jenkins") {
          return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build.buildId);
        }
      };
    }
  });
}(jashboard.plugin.build || {}));
