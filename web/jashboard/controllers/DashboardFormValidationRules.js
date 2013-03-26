(function(module) {
  jashboard = _.extend(module, {
    DashboardFormValidationRules: function(scope) {
      var scopeRules = new jashboard.ScopeValidationRules(scope);
      
      this.dashboardName = scopeRules.required('dashboardName');      
    }
  });
}(jashboard || {}));
