(function(module) {
  jashboard = _.extend(module, {
    IpsumMonitorFormValidationRules: function(scope) {
      var validationRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.required)
        .withRule(jashboard.commonValidationRules.positiveInteger)
        .build();
      
      this.numberOfSentences = function() { return validationRule(scope.monitorConfigurationFormModel.ipsum.numberOfSentences) };
    }
  });
}(jashboard || {}));
