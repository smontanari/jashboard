(function(module) {
  jashboard = _.extend(module, {
    ModelMapper: function(pluginManager) {
      var that = this;
      this.mapDataToMonitor = function(monitorData) {
        return _.tap(new jashboard.model.Monitor(monitorData), function(monitor) {
          var monitorAdapter = pluginManager.findMonitorAdapter(monitor.type);
          monitor.configuration = monitorAdapter.convertDataToMonitorConfiguration(monitorData.configuration);
        });
      };

      this.mapDataToMonitorRuntimeInfo = function(monitorType, monitorRuntimeData) {
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        return monitorAdapter.convertDataToRuntimeInfo(monitorRuntimeData);
      };

      this.mapMonitorConfigurationToData = function(monitorType, monitorConfiguration) {
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        return monitorAdapter.convertMonitorConfigurationToData(monitorConfiguration);
      };

      this.mapMonitorToData = function(monitor) {
        var monitorAdapter = pluginManager.findMonitorAdapter(monitor.type);
        return _.tap(_.pick(monitor, "name", "type", "size", "position"), function(data) {
          data.refresh_interval = monitor.refreshInterval;
          data.configuration = monitorAdapter.convertMonitorConfigurationToData(monitor.configuration)
        });
      };

      this.mapDataToDashboard = function(dashboardData) {
        return _.tap(new jashboard.model.Dashboard(dashboardData), function(dashboard) {
          _.each(dashboardData.monitors, function(monitorData) {
            dashboard.monitors.push(that.mapDataToMonitor(monitorData));
          });
        });
      };
    }
  });
  jashboard.services.service('ModelMapper', ['PluginManager', jashboard.ModelMapper]).run(function() {
    steal.dev.log("ModelMapper initialized");
  });
}(jashboard || {}));
