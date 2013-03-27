(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function(scope) {
      var rules = {
        monitorName: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.CommonValidationRules.required)
          .build(),
        monitorRefresh: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.CommonValidationRules.number)
          .withRule(jashboard.CommonValidationRules.positiveNumber)
          .build()
      };
      
      this.monitorName = function() { return rules.monitorName(scope.inputMonitor.name) };
      this.monitorRefresh = function() { return rules.monitorRefresh(scope.inputMonitor.refreshInterval) };
    }
  });
}(jashboard || {}));
