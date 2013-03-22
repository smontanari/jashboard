(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      var saveMonitorCallback = function() {
        var dashboard = _.find(scope.dashboards, function(dashboard) {
          return (dashboard.id === scope.monitorForm.dashboard_id);
        });
        var monitorType = scope.monitorForm.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorParameters = {
          name: scope.monitorForm.name,
          refreshInterval: parseInt(scope.monitorForm.refreshInterval, 10),
          type: scope.monitorForm.type,
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize()),
          configuration: monitorAdapter.validateConfiguration(scope.monitorForm.configuration[monitorType])
        };
        scope.$emit("MonitorSavingStart");
        repository.createMonitor(scope.monitorForm.dashboard_id, monitorParameters, {
          success: function(monitor) {
            dashboard.monitors.push(monitor);
            scope.$apply();
            scope.$emit("MonitorSavingComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
        });
        scope.$emit("CloseMonitorDialog");
      };
      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();

      scope.$on("OpenMonitorDialog", function(event, dashboard_id) {
        scope.monitorForm = {dashboard_id: dashboard_id, configuration: {}};
        scope.workflow = new jashboard.CreateMonitorWorkflow(saveMonitorCallback);
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
