(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function(scope) {
      var monitorNameValidation = new jashboard.ValidationRulesBuilder()
        .withRule('required')
        .build();

      var monitorRefreshValidation = new jashboard.ValidationRulesBuilder()
        .withRule('number')
        .build();
      
      this.monitorName = function() { return monitorNameValidation(scope.monitorName) };
      this.monitorRefresh = function() { return monitorRefreshValidation(scope.monitorRefresh) };
    }
  });
}(jashboard || {}));
