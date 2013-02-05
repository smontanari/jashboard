jashboard.defineNamespace("jashboard.model", function() {
  jashboard.model.Dashboard = function(dashboardData) {
    this.id = dashboardData.id;
    this.name = dashboardData.name;
    this.monitors = [];
  };
});