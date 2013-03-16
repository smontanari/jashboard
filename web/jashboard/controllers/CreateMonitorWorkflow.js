(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorWorkflow: function(scope, repository, pluginManager) {
      var addMonitorToDashboard = function(monitor, dashboard_id) {
        var dashboard = _.find(scope.dashboards, function(dashboard) {
            return (dashboard.id === dashboard_id);
          });
          dashboard.monitors.push(monitor);
          scope.$apply();
      }
      this.actions = ["next"];
      this.state = "showGenericConfiguration";

      this.next = function() {
        this.state = "showSelectedConfiguration";
        this.actions = ["back", "save"];
      };

      this.back = function() {
        this.state = "showGenericConfiguration";
        this.actions = ["next"];
      };

      this.save = function() {
        var monitorType = scope.monitorForm.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorParameters = {
          name: scope.monitorForm.name,
          refreshInterval: parseInt(scope.monitorForm.refreshInterval, 10),
          type: scope.monitorForm.type,
          configuration: monitorAdapter.validateConfiguration(scope.monitorForm.configuration[monitorType])
        };
        scope.$emit("MonitorSavingStart");
        repository.createMonitor(scope.monitorForm.dashboard_id, monitorParameters, {
          success: function(monitor) {
            addMonitorToDashboard(monitor, scope.monitorForm.dashboard_id);
            scope.$emit("MonitorSavingComplete");
          }
        });
        scope.$emit("CloseMonitorDialog");
      };
    }
  });
}(jashboard || {}));
