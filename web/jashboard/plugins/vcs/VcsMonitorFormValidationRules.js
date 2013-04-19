(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorFormValidationRules: function() {
      var requiredPositiveIntegerRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();

      this.vcsWorkingDir = function(scope) {
        if (scope.monitorConfigurationFormModel.vcs) {
          return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.vcs.workingDirectory);
        }
      };
      this.vcsHistoryLength = function(scope) {
        if (scope.monitorConfigurationFormModel.vcs) {
          return requiredPositiveIntegerRule(scope.monitorConfigurationFormModel.vcs.historyLength);
        }
      };
      this.vcsPageSize = function(scope) {
        if (scope.monitorConfigurationFormModel.vcs) {
          if (scope.monitorConfigurationFormModel.vcs.slideShowEffect) {
            return requiredPositiveIntegerRule(scope.monitorConfigurationFormModel.vcs.commitsPerPage);
          }
        }
      };
    }
  });
}(jashboard.plugin.vcs || {}));
