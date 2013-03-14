(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorWorkflow: function(scope, repository, pluginManager) {
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
            scope.$emit("NewMonitorCreated", monitor);
          }
        });
        scope.$emit("CloseMonitorDialog");
      };
    }
  });
}(jashboard || {}));
