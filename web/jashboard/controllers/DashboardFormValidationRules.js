(function(module) {
  jashboard = _.extend(module, {
    DashboardFormValidationRules: function(scope) {
      var validation = new jashboard.ValidationRulesBuilder()
        .withRule(jashboard.CommonValidationRules.required)
        .build();
      
      this.dashboardName = function() { return validation(scope.dashboardName) };
    }
  });
}(jashboard || {}));
