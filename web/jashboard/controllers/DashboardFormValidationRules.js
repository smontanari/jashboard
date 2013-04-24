(function(module) {
  jashboard = _.extend(module, {
    DashboardFormValidationRules: function(scope) {
      this.dashboardName = function() { return jashboard.commonValidationRules.required(scope.dashboardFormModel.name);};
    }
  });
}(jashboard || {}));
