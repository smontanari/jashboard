(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormValidationRules: function(scope) {
      var validationRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();
      
      this.numberOfSentences = function(scope) {
        if (scope.monitorConfigurationFormModel.ipsum) {
          return validationRule(scope.monitorConfigurationFormModel.ipsum.numberOfSentences); 
        }
      };
    }
  });
}(jashboard.plugin.ipsum || {}));
