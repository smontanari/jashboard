(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function(scope) {
      var monitorRefreshRule = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.commonValidationRules.number)
        .withRule(jashboard.commonValidationRules.positiveNumber)
        .build();
      
      this.monitorName = function() { return jashboard.commonValidationRules.required(scope.monitorFormModel.name); };
      this.monitorRefresh = function() { return monitorRefreshRule(scope.monitorFormModel.refreshInterval); };;
    }
  });
}(jashboard || {}));
