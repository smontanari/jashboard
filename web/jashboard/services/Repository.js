jashboard.Repository = function(http) {
  this.loadDashboards = function(handler) {
    http.getJSON("/ajax/dashboards")
    .success(function(data) {
      dashboards = _.map(data, function(dashboard_data) {
        return new jashboard.model.Dashboard(dashboard_data);
      });
      handler(dashboards);
    });
  };
  
  this.loadMonitorRuntime = function(monitor_id, handler) {
    http.getJSON("/ajax/monitor/" + monitor_id + "/runtime")
    .success(function(monitor_data) {
      handler(jashboard.types.monitorRuntimeTypeAdapter.toObject(monitor_data));
    });
  };

  this.createDashboard = function(dashboardParameters, handler) {
    http.postJSON("/ajax/dashboard", dashboardParameters)
    .success(function(dashboard_data) {
      handler(new jashboard.model.Dashboard(dashboard_data));
    });
  };

  this.createMonitor = function(monitorParameters, handler) {
    http.postJSON("/ajax/monitor", monitorParameters)
    .success(function(monitor_data) {
      handler(new jashboard.model.Monitor(monitor_data));
    });    
  }
};

jashboard.services.service('Repository', ['HttpService', jashboard.Repository]).run(function() {
  steal.dev.log("Repository initialized");
});

