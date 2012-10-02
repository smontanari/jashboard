jashboard.model.Dashboard = function(dashboardData) {
  this.id = dashboardData.id;
  this.name = dashboardData.name;
  if (dashboardData.monitorData) {
    this.monitors = _.map(dashboardData.monitorData, function(data) { return new jashboard.model.Monitor(data); });
  } else {
    this.monitors = [];
  };
};
