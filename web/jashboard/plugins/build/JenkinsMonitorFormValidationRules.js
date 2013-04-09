(function(module) {
  jashboard.plugin.build = _.extend(module, {
    JenkinsMonitorFormValidationRules: function() {
      this.jenkinsBuildId = function(scope) {
        if (scope.monitorConfigurationFormModel.build.type === "jenkins") {
          return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build.build_id);
        }
      };
    }
  });
}(jashboard.plugin.build || {}));
