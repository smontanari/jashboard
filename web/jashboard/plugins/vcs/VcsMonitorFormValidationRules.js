(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorFormValidationRules: function(scope) {
      var requiredPositiveIntegerRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();


      var rules = {
        vcsWorkingDir: function() { return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.vcs.workingDirectory); },
        vcsHistoryLength: function() { return requiredPositiveIntegerRule(scope.monitorConfigurationFormModel.vcs.historyLength); },
        vcsPageSize: function() {
          if (scope.monitorConfigurationFormModel.vcs.pagination) {
            return requiredPositiveIntegerRule(scope.monitorConfigurationFormModel.vcs.commitsPerPage);
          }
        },
        vcsPageInterval: function() {
          if (scope.monitorConfigurationFormModel.vcs.pagination) {
            return requiredPositiveIntegerRule(scope.monitorConfigurationFormModel.vcs.interval);
          }
        }
      };

      var self = this;
      _.each(_.keys(rules), function(inputName) {
        self[inputName] = _.wrap(rules[inputName], function(rule) {
          if (scope.monitorConfigurationFormModel.vcs) {
            return rule();
          }  
        });
      });
    }
  });
}(jashboard.plugin.vcs || {}));
