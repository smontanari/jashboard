(function(module) {
  jashboard = _.extend(module, {
    MonitorFormValidationRules: function(scope) {
      var scopeRules = new jashboard.ScopeValidationRulesBuilder(scope);
      
      this.monitorName = scopeRules.required('monitorName');
      this.monitorRefresh = scopeRules.number("monitorRefresh");
    }
  });
}(jashboard || {}));
