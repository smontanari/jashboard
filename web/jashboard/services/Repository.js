jashboard.Repository = function(http, pluginManager) {
  var createDashboard = function(dashboard_data) {
    var dashboard = new jashboard.model.Dashboard(dashboard_data);
    _.each(dashboard_data.monitors, function(monitor_data) {
      dashboard.monitors.push(createMonitor(monitor_data));
    });
    return dashboard;
  };
  var createMonitor = function(monitor_data) {
    return _.tap(new jashboard.model.Monitor(monitor_data), function(monitor) {
      var monitorAdapter = pluginManager.findMonitorAdapter(monitor.type);
      monitor.settings = monitorAdapter.parseSettings(monitor_data.settings);
    });
  };

  this.loadDashboards = function(handler) {
    http.getJSON("/ajax/dashboards")
    .success(function(data) {
      handler(_.map(data, createDashboard));
    });
  };
  
  this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handler) {
    http.getJSON("/ajax/monitor/" + monitor_id + "/runtime")
    .success(function(monitor_data) {
      var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
      handler(monitorAdapter.parseRuntimeInfo(monitor_data));
    });
  };

  this.createDashboard = function(dashboardParameters, handler) {
    http.postJSON("/ajax/dashboard", dashboardParameters)
    .success(function(dashboard_data) {
      handler(createDashboard(dashboard_data));
    });
  };

  this.createMonitor = function(monitorParameters, handler) {
    http.postJSON("/ajax/monitor", monitorParameters)
    .success(function(monitor_data) {
      handler(createMonitor(monitor_data));
    });    
  }
};

jashboard.services.service('Repository', ['HttpService', 'PluginManager', jashboard.Repository]).run(function() {
  steal.dev.log("Repository initialized");
});

