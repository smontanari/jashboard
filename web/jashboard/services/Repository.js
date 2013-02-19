jashboard.Repository = function(http, modelMapper) {
  this.loadDashboards = function(handler) {
    http.getJSON("/ajax/dashboards")
    .success(function(data) {
      handler(_.map(data, modelMapper.mapDashboard));
    });
  };
  
  this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handler) {
    http.getJSON("/ajax/monitor/" + monitor_id + "/runtime")
    .success(function(monitorRuntimeData) {
      handler(modelMapper.mapMonitorRuntimeInfo(monitorType, monitorRuntimeData));
    });
  };

  this.createDashboard = function(parameters, handler) {
    http.postJSON("/ajax/dashboard", parameters)
    .success(function(dashboardData) {
      handler(modelMapper.mapDashboard(dashboardData));
    });
  };

  this.createMonitor = function(dashboard_id, monitorParameters, handler) {
    http.postJSON("/ajax/dashboard/" + dashboard_id + "/monitor", monitorParameters)
    .success(function(monitorData) {
      handler(modelMapper.mapMonitor(monitorData));
    });    
  }

  this.updateMonitorPosition = function(monitor_id, position) {
    http.putJSON("/ajax/monitor/" + monitor_id + "/position", position);
  }
};

jashboard.services.service('Repository', ['HttpService', 'ModelMapper', jashboard.Repository]).run(function() {
  steal.dev.log("Repository initialized");
});

