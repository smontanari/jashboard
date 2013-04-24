(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorFormValidationRules: function(scope) {
      var serverPortRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();

      var rules = {
        buildServerName: function() { return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build.hostname); },
        buildServerPort: function() { return serverPortRule(scope.monitorConfigurationFormModel.build.port); }
      };

      var self = this;
      _.each(_.keys(rules), function(inputName) {
        self[inputName] = _.wrap(rules[inputName], function(rule) {
          if (scope.monitorConfigurationFormModel.build) {
            return rule();
          }  
        });
      });
    }
  });
}(jashboard.plugin.build || {}));
