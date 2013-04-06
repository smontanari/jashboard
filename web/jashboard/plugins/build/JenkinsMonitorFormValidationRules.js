(function(module) {
  jashboard.plugin.build = _.extend(module, {
    JenkinsMonitorFormValidationRules: function() {
      this.jenkins_build_id = function(scope) {
        if (scope.monitorConfigurationFormModel.build.type === "jenkins") {
          return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build.build_id);
        }
      };
    }
  });
}(jashboard.plugin.build || {}));
