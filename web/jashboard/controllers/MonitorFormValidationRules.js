(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function(scope) {
      var rules = {
        monitorName: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.commonValidationRules.required)
          .build(),
        monitorRefresh: new jashboard.ValidationRulesBuilder()
          .withRule(jashboard.commonValidationRules.number)
          .withRule(jashboard.commonValidationRules.positiveNumber)
          .build()
      };
      
      this.monitorName = function() { return rules.monitorName(scope.baseMonitorData.name) };
      this.monitorRefresh = function() { return rules.monitorRefresh(scope.baseMonitorData.refreshInterval) };
    }
  });
}(jashboard || {}));
