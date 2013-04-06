(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function() {
      var monitorRefreshRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.number)
        .withRule(jashboard.commonValidationRules.positiveNumber)
        .build();
      
      this.monitorName = function(scope) { return jashboard.commonValidationRules.required(scope.baseMonitorData.name); };
      this.monitorRefresh = function(scope) { return monitorRefreshRule(scope.baseMonitorData.refreshInterval); };;
    }
  });
}(jashboard || {}));
