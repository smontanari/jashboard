jashboard.model.Dashboard = function(dashboardData) {
  var self = this;
  var addMonitor = function(monitorData) {
    self.monitors.push(new jashboard.model.Monitor(monitorData));
  };

  this.id = dashboardData.id;
  this.name = dashboardData.name;
  this.monitors = [];
  _.each(dashboardData.monitors, addMonitor);
};
