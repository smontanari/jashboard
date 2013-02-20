(function(module) {
  jashboard.model = _.extend(module, {
    Dashboard: function(dashboardData) {
      this.id = dashboardData.id;
      this.name = dashboardData.name;
      this.monitors = [];
    }
  });
}(jashboard.model || {}));
