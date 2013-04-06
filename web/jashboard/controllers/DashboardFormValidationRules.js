(function(module) {
  jashboard = _.extend(module, {
    DashboardFormValidationRules: function() {
      this.dashboardName = function(scope) { return jashboard.commonValidationRules.required(scope.dashboardFormModel.name);};
    }
  });
}(jashboard || {}));
