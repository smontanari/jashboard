(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormValidationRules: function() {
      var validationRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();
      
      this.ipsumNumberOfSentences = function(scope) {
        if (scope.monitorConfigurationFormModel.ipsum) {
          return validationRule(scope.monitorConfigurationFormModel.ipsum.numberOfSentences); 
        }
      };
    }
  });
}(jashboard.plugin.ipsum || {}));
