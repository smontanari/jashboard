(function(module) {
  jashboard = _.extend(module, {
    ModelMapper: function(pluginManager) {
      var that = this;
      this.mapMonitor = function(monitorData) {
        return _.tap(new jashboard.model.Monitor(monitorData), function(monitor) {
          var monitorAdapter = pluginManager.findMonitorAdapter(monitor.type);
          monitor.configuration = monitorAdapter.convertDataToMonitorConfiguration(monitorData.configuration);
        });
      };

      this.mapMonitorRuntimeInfo = function(monitorType, monitorRuntimeData) {
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        return monitorAdapter.convertDataToRuntimeInfo(monitorRuntimeData);
      };

      this.mapDashboard = function(dashboardData) {
        return _.tap(new jashboard.model.Dashboard(dashboardData), function(dashboard) {
          _.each(dashboardData.monitors, function(monitorData) {
            dashboard.monitors.push(that.mapMonitor(monitorData));
          });
        });
      };
    }
  });
  jashboard.services.service('ModelMapper', ['PluginManager', jashboard.ModelMapper]).run(function() {
    steal.dev.log("ModelMapper initialized");
  });
}(jashboard || {}));
